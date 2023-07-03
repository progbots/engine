import { ValueType, IArray, IState, StateFactorySettings, EngineSignal, IStateFlags, IStateMemory } from '../index'
import { BusyParsing, Internal } from '../errors/index'
import { InternalValue, OperatorFunction, parse } from './index'
import { CallStack, CallValue, DictionaryStack, OperandStack, Stack } from '../objects/stacks/index'
import { MemoryTracker } from './MemoryTracker'
import { InternalError } from '../errors/InternalError'
import { renderCallStack } from './callstack'
import { wrapError } from './error'

interface RunHandler {
  before: EngineSignal
  after: EngineSignal
  run: (this: State, value: CallValue) => Generator
}

const unexpectedHandler: RunHandler = {
  before: EngineSignal.beforeOperand,
  after: EngineSignal.afterOperand,
  * run (value: CallValue): Generator {
    throw new Internal(`Unexpected value type '${value.type}' in callstack`)
  }
}

export class State implements IState {
  private readonly _memoryTracker: MemoryTracker
  private readonly _dictionaries: DictionaryStack
  private readonly _operands: OperandStack
  private readonly _calls: CallStack
  private readonly _keepDebugInfo: boolean = false
  private _noCall: number = 0
  private readonly _runHandlers: Record<ValueType, RunHandler> = {
    [ValueType.boolean]: unexpectedHandler,
    [ValueType.integer]: unexpectedHandler,
    [ValueType.string]: {
      before: EngineSignal.beforeParse,
      after: EngineSignal.afterParse,
      run: this.runParse
    },
    [ValueType.call]: {
      before: EngineSignal.beforeCall,
      after: EngineSignal.afterCall,
      run: this.runCall
    },
    [ValueType.operator]: {
      before: EngineSignal.beforeOperator,
      after: EngineSignal.afterOperator,
      run: this.runOperator
    },
    [ValueType.mark]: unexpectedHandler,
    [ValueType.array]: unexpectedHandler,
    [ValueType.dict]: unexpectedHandler,
    [ValueType.block]: {
      before: EngineSignal.beforeProc,
      after: EngineSignal.afterProc,
      run: this.runBlockOrProc
    },
    [ValueType.proc]: {
      before: EngineSignal.beforeProc,
      after: EngineSignal.afterProc,
      run: this.runBlockOrProc
    }
  }

  constructor (settings: StateFactorySettings = {}) {
    this._memoryTracker = new MemoryTracker(settings.maxMemoryBytes)
    this._dictionaries = new DictionaryStack(this._memoryTracker, settings.hostDictionary)
    this._operands = new OperandStack(this._memoryTracker)
    this._calls = new CallStack(this._memoryTracker)
    if (settings.keepDebugInfo === true) {
      this._keepDebugInfo = true
    }
  }

  // region IState

  get memory (): IStateMemory {
    return this._memoryTracker
  }

  get flags (): IStateFlags {
    return {
      debug: this._keepDebugInfo,
      parsing: this._calls.length > 0,
      call: this._noCall === 0
    }
  }

  get operands (): OperandStack {
    return this._operands
  }

  get dictionaries (): DictionaryStack {
    return this._dictionaries
  }

  get calls (): Stack {
    return this._calls
  }

  parse (source: string, sourceFile?: string): Generator {
    if (this._calls.length > 0) {
      wrapError(new BusyParsing())
    }
    this._calls.push({
      type: ValueType.string,
      data: source,
      untracked: true, // because external
      sourceFile,
      sourcePos: 0
    })
    return this.run()
  }

  // endregion IState

  get memoryTracker (): MemoryTracker {
    return this._memoryTracker
  }

  preventCall (): void {
    ++this._noCall
  }

  allowCall (): void {
    --this._noCall
  }

  get callstack (): CallStack {
    return this._calls
  }

  private * run (): Generator {
    let error: Error | undefined

    const catchError = (callback: () => any): any => {
      try {
        return callback()
      } catch (e) {
        if (!(e instanceof Error)) {
          error = new Internal('Unexpected exception')
        } else {
          error = e
          if (error instanceof InternalError) {
            error.callstack = renderCallStack(this.calls)
          }
        }
      }
    }

    while (this._calls.length > 0) {
      const [first, second] = this._calls.ref
      let top: CallValue
      if (first.type === ValueType.integer) {
        top = second
      } else {
        top = first
      }

      let next = false

      if (top.generator !== undefined) {
        const generator = top.generator
        const { done, value } = catchError(() => generator.next())
        if (error === undefined) {
          yield value
          next = done
        }
      } else {
        const handler = this._runHandlers[top.type]
        yield handler.before
        top.after = handler.after
        top.generator = handler.run.call(this, top)
      }

      if (error instanceof InternalError && top.catch !== undefined) {
        const internalError = error
        const topCatch = top.catch
        catchError(() => topCatch(internalError))
      }

      if (next) {
        if (top.finally !== undefined) {
          catchError(top.finally)
        }
        if (top.after !== undefined) {
          yield top.after
        }
        if (this._calls.top.type === ValueType.integer) {
          this._calls.pop()
        }
        this._calls.pop()
      }
    }

    if (error !== undefined) {
      wrapError(error)
    }
  }

  private * triage (value: InternalValue): Generator {
    const { type } = value
    if ([ValueType.proc, ValueType.block, ValueType.operator].includes(type)) {
      this._calls.push(value)
    } else if (type === ValueType.call && (this._noCall === 0 || ['{', '}'].includes(value.data))) {
      this._calls.push(value)
    } else {
      yield EngineSignal.beforeOperand
      this.operands.push(value)
      yield EngineSignal.afterOperand
    }
  }

  private * runCall (value: CallValue): Generator {
    const resolvedValue = this._dictionaries.lookup(value.data as string)
    yield * this.triage(resolvedValue)
  }

  private * runOperator (value: CallValue): Generator {
    const operator = value.data as OperatorFunction
    const iterator = operator(this)
    if (iterator !== undefined) {
      yield * iterator
    }
  }

  public * runBlockOrProc (value: CallValue): Generator {
    const proc = value.data as IArray
    const { length } = proc
    for (let index = 0; index < length; ++index) {
      yield * this.triage(proc.at(index))
    }
  }

  public * runParse (value: CallValue): Generator {
    const { data: source, sourceFile } = value
    const parser = parse(source as string, sourceFile)
    for (const parsedValue of parser) {
      this._calls.push({
        type: ValueType.integer,
        data: parsedValue.sourcePos as number
      })
      try {
        yield EngineSignal.tokenParsed
        const value: InternalValue = { ...parsedValue }
        if (!this._keepDebugInfo) {
          delete value.source
          delete value.sourcePos
          delete value.sourceFile
        }
        yield * this.triage(value)
      } finally {
        this._calls.pop()
      }
    }
  }
}

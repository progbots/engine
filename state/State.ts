import { ValueType, IArray, IState, StateFactorySettings, EngineSignal, IStateFlags, IStateMemory } from '../index'
import { BusyParsing, Internal } from '../errors/index'
import { InternalValue, OperatorFunction, parse } from './index'
import { CallStack, CallValue, DictionaryStack, OperandStack, Stack } from '../objects/stacks/index'
import { MemoryTracker } from './MemoryTracker'
import { InternalError } from '../errors/InternalError'
import { renderCallStack } from './callstack'
import { wrapError } from './error'

function * runUnexpected (value: CallValue): Generator {
  throw new Internal('Unexpected value type in callstack')
}

export class State implements IState {
  private readonly _memoryTracker: MemoryTracker
  private readonly _dictionaries: DictionaryStack
  private readonly _operands: OperandStack
  private readonly _calls: CallStack
  private readonly _keepDebugInfo: boolean = false
  private _noCall: number = 0
  private readonly _handlers: Record<ValueType, (this: State, value: CallValue) => Generator> = {
    [ValueType.boolean]: runUnexpected,
    [ValueType.integer]: runUnexpected,
    [ValueType.string]: runUnexpected,
    [ValueType.call]: this.runCall.bind(this),
    [ValueType.operator]: this.runOperator.bind(this),
    [ValueType.mark]: runUnexpected,
    [ValueType.array]: runUnexpected,
    [ValueType.dict]: runUnexpected,
    [ValueType.block]: runUnexpected,
    [ValueType.proc]: runUnexpected
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

  get callstack () : CallStack {
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
      const hasIndex = first.type === ValueType.integer
      if (hasIndex) {
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
        // execute top
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
        if (top.signalAfter !== undefined) {
          yield top.signalAfter
        }
        this._calls.pop()
        if (hasIndex) {
          this._calls.pop()
        }
      }
    }

    if (error !== undefined) {
      wrapError(error)
    }
  }

  @run(ValueType.call, EngineSignal.beforeCall, EngineSignal.afterCall)
  private * runCall (value: CallValue): Generator {
    const resolvedValue = this._dictionaries.lookup(value.data as string)
    this.callstack.push(resolvedValue)
  }

  @run(ValueType.operator, EngineSignal.beforeOperator, EngineSignal.afterOperator)
  private * runOperator (value: CallValue): Generator {
    const operator = value.data as OperatorFunction
    const iterator = operator(this)
    if (iterator !== undefined) {
      yield * iterator
    }
  }

  @run(ValueType.proc, EngineSignal.beforeProc, EngineSignal.afterProc)
  @run(ValueType.block, EngineSignal.beforeProc, EngineSignal.afterProc)
  public * runBlockOrProc (value: CallValue): Generator {
    const proc = value.data as IArray
    const { length } = proc
    for (let index = 0; index < length; ++index) {
      this.callstack.push({
        ...proc.at(index)
      })
    }
  }

  @run(ValueType.boolean, EngineSignal.beforeOperand, EngineSignal.afterOperand)
  @run(ValueType.boolean, EngineSignal.beforeOperand, EngineSignal.afterOperand)
  @run(ValueType.block, EngineSignal.beforeProc, EngineSignal.afterProc)
  private * evalWithoutProc (value: InternalValue): Generator {
    if (value.type === ValueType.call && (this._noCall === 0 || ['{', '}'].includes(value.data))) {
      yield * this.evalCall(value)
    } else if (value.type === ValueType.operator) {
      yield * this.evalOperator(value)
    } else {
      yield EngineSignal.beforeOperand
      this.operands.push(value)
      yield EngineSignal.afterOperand
    }
  }

  @run(ValueType.string, EngineSignal.beforeParse, EngineSignal.afterParse)
  public * runParse (source: string, sourceFile?: string): Generator {
    const parser = parse(source, sourceFile)
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
        yield * this.eval(value)
      } finally {
        this._calls.pop()
      }
    }
  }
}

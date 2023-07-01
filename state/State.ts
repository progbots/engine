import { ValueType, IArray, IState, StateFactorySettings, EngineSignal, IStateFlags, IStateMemory } from '../index'
import { BusyParsing, Internal } from '../errors/index'
import { InternalValue, OperatorFunction, parse } from './index'
import { CallStack, CallValue, DictionaryStack, OperandStack, Stack } from '../objects/stacks/index'
import { MemoryTracker } from './MemoryTracker'
import { InternalError } from '../errors/InternalError'
import { renderCallStack } from './callstack'
import { wrapError } from './error'

export class State implements IState {
  private readonly _memoryTracker: MemoryTracker
  private readonly _dictionaries: DictionaryStack
  private readonly _operands: OperandStack
  private readonly _calls: CallStack
  private readonly _keepDebugInfo: boolean = false
  private _noCall: number = 0

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

    const handlers: Record<ValueType, (this: State, value: CallValue) => Generator> = {
      [ValueType.call]: function * (value: CallValue) {
        yield EngineSignal.beforeCall
        const resolvedValue = this._dictionaries.lookup(value.data as string)
        this.callstack.push(resolvedValue)
        yield EngineSignal.afterCall
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

      if (top.signalBefore !== undefined) {
        yield top.signalBefore
        top.signalBefore = undefined
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

/*
  private * evalCall (value: InternalValue): Generator {
    yield * this.wrapStep(value, {
      before: EngineSignal.beforeCall,
      after: EngineSignal.afterCall
    }, function * (this: State): Generator {
      yield * this.eval(this._dictionaries.lookup(value.data as string))
    })
  }

  private * evalOperator (value: InternalValue): Generator {
    yield * this.wrapStep(value, {
      before: EngineSignal.beforeOperator,
      after: EngineSignal.afterOperator
    }, function * (this: State): Generator {
      const operator = value.data as OperatorFunction
      yield * operator(this)
    })
  }

  public call (value: CallValue): void {
  }

  public * evalBlockOrProc (value: InternalValue): Generator {
    yield * this.wrapStep(value, {
      before: EngineSignal.beforeProc,
      after: EngineSignal.afterProc
    }, function * (this: State): Generator {
      const proc = value.data as IArray
      const { length } = proc
      for (let index = 0; index < length; ++index) {
        yield * this.wrapStep({
          type: ValueType.integer,
          data: index
        }, {
          before: EngineSignal.beforeProcItem,
          after: EngineSignal.afterProcItem
        }, function * (this: State): Generator {
          yield * this.eval(proc.at(index))
        })
      }
    })
  }

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

  private * eval (value: InternalValue): Generator {
    if (value.type === ValueType.proc) {
      yield * this.evalBlockOrProc(value)
    } else {
      yield * this.evalWithoutProc(value)
    }
  }

  private * outerParse (source: string, sourceFile?: string): Generator {
    try {
      yield * this.innerParse(source, sourceFile)
    } catch (e) {
      this.wrapError(e as Error)
    } finally {
      this._parsing = false
    }
  }

  public * innerParse (source: string, sourceFile?: string): Generator {
    yield * this.wrapStep({
      type: ValueType.string,
      data: source,
      untracked: true, // because external
      sourceFile,
      sourcePos: 0
    }, {
      before: EngineSignal.beforeParse,
      after: EngineSignal.afterParse
    }, function * (this: State): Generator {
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
    })
  }
*/
}

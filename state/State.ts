import { ValueType, IArray, IState, StateFactorySettings } from '../index'
import { Break, BusyParsing, InvalidBreak } from '../errors/index'
import { InternalValue, OperatorFunction, parse } from './index'
import { DictionaryStack, OperandStack, Stack } from '../objects/stacks/index'
import { MemoryTracker } from './MemoryTracker'
import { InternalError } from '../errors/InternalError'
import { renderCallStack } from './callstack'

export class State implements IState {
  private readonly _memoryTracker: MemoryTracker
  private readonly _dictionaries: DictionaryStack
  private readonly _operands: OperandStack
  private readonly _calls: Stack
  private readonly _keepDebugInfo: boolean = false
  private _noCall: number = 0
  private _parsing: boolean = false

  constructor (settings: StateFactorySettings = {}) {
    this._memoryTracker = new MemoryTracker(settings.maxMemoryBytes)
    this._dictionaries = new DictionaryStack(this._memoryTracker, settings.hostDictionary)
    this._operands = new OperandStack(this._memoryTracker)
    this._calls = new Stack(this._memoryTracker)
    if (settings.keepDebugInfo === true) {
      this._keepDebugInfo = true
    }
  }

  // region IState

  get usedMemory (): number {
    return this._memoryTracker.used
  }

  get totalMemory (): number {
    return this._memoryTracker.total
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

  get parsing (): boolean {
    return this._parsing
  }

  parse (source: string, sourceFile?: string): Generator {
    if (this._parsing) {
      this.wrapError(new BusyParsing())
    }
    this._parsing = true
    return this.outerParse(source, sourceFile)
  }

  // endregion IState

  get memoryTracker (): MemoryTracker {
    return this._memoryTracker
  }

  get keepDebugInfo (): boolean {
    return this._keepDebugInfo
  }

  preventCall (): void {
    ++this._noCall
  }

  allowCall (): void {
    --this._noCall
  }

  private wrapError (error: Error): void {
    // No internal error should go out because memory cannot be controlled (and they are not documented)
    if (error instanceof Break) {
      const invalidBreak = new InvalidBreak()
      invalidBreak.callstack = error.callstack
      error = invalidBreak
    }
    // No internal error should go out because memory cannot be controlled (and they are not documented)
    if (error instanceof InternalError) {
      const ex = new Error(error.message)
      ex.name = error.name
      ex.stack = error.callstack
      error.release()
      throw ex
    }
    throw error
  }

  private * wrapCall (value: InternalValue, call: () => Generator): Generator {
    this._calls.push(value)
    yield // execution cycle
    try {
      yield * call.apply(this)
    } catch (e) {
      if (e instanceof InternalError) {
        e.callstack = renderCallStack(this.calls)
      }
      throw e
    } finally {
      this._calls.pop()
    }
  }

  private * evalCall (value: InternalValue): Generator {
    yield * this.wrapCall(value, function * (this: State): Generator {
      yield * this.eval(this._dictionaries.lookup(value.data as string))
      yield // execution cycle
    })
  }

  private * evalOperator (value: InternalValue): Generator {
    yield * this.wrapCall(value, function * (this: State): Generator {
      const operator = value.data as OperatorFunction
      yield * operator(this)
    })
  }

  private * evalProc (value: InternalValue): Generator {
    yield * this.wrapCall(value, function * (this: State): Generator {
      const proc = value.data as IArray
      const { length } = proc
      for (let index = 0; index < length; ++index) {
        this._calls.push({
          type: ValueType.integer,
          data: index
        })
        try {
          yield * this.evalWithoutProc(proc.at(index))
        } finally {
          this._calls.pop()
        }
      }
    })
  }

  private * evalWithoutProc (value: InternalValue): Generator {
    if (value.type === ValueType.call && (this._noCall === 0 || ['{', '}'].includes(value.data as string))) {
      yield * this.evalCall(value)
    } else if (value.type === ValueType.operator) {
      yield * this.evalOperator(value)
    } else {
      this.operands.push(value)
      yield // execution cycle
    }
  }

  * eval (value: InternalValue): Generator {
    if (value.type === ValueType.proc) { // } && this._noCall === 0) {
      yield * this.evalProc(value)
    } else {
      yield * this.evalWithoutProc(value)
    }
  }

  * outerParse (source: string, sourceFile?: string): Generator {
    try {
      yield * this.innerParse(source, sourceFile)
    } catch (e) {
      this.wrapError(e as Error)
    } finally {
      this._parsing = false
    }
  }

  * innerParse (source: string, sourceFile?: string): Generator {
    yield * this.wrapCall({
      type: ValueType.string,
      data: source,
      untracked: true, // because external
      sourceFile,
      sourcePos: 0
    }, function * (this: State): Generator {
      const parser = parse(source, sourceFile)
      for (const parsedValue of parser) {
        this._calls.push({
          type: ValueType.integer,
          data: parsedValue.sourcePos as number
        })
        try {
          yield // parse cycle
          let value
          if (this._keepDebugInfo) {
            value = parsedValue
          } else {
            const { type, data } = parsedValue
            value = { type, data }
          }
          yield * this.eval(value)
        } finally {
          this._calls.pop()
        }
      }
    })
  }
}

import { ValueType, IArray, IDictionary, Value, IState, StateFactorySettings } from '..'
import { Break, BusyParsing, DictStackUnderflow, InvalidBreak, Undefined } from '../errors'
import { InternalValue, OperatorFunction, parse } from '.'
import { Stack } from '../objects/Stack'
import { MemoryTracker } from './MemoryTracker'
import { Dictionary, SystemDictionary } from '../objects/dictionaries'
import { HostDictionary } from '../objects/dictionaries/Host'
import { BaseError } from '../errors/BaseError'
import { renderCallStack } from './callstack'

export class State implements IState {
  private readonly _memoryTracker: MemoryTracker
  private readonly _systemdict: SystemDictionary = new SystemDictionary()
  private readonly _globaldict: Dictionary
  private readonly _minDictCount: number
  private readonly _dictionaries: Stack
  private readonly _operands: Stack
  private readonly _calls: Stack
  private readonly _keepDebugInfo: boolean = false
  private _noCall: number = 0

  constructor (settings: StateFactorySettings = {}) {
    this._memoryTracker = new MemoryTracker(settings.maxMemoryBytes)
    this._dictionaries = new Stack(this._memoryTracker)
    this._globaldict = new Dictionary(this._memoryTracker)
    if (settings.hostDictionary != null) {
      this.begin(new HostDictionary(settings.hostDictionary))
    }
    if (settings.keepDebugInfo === true) {
      this._keepDebugInfo = true
    }
    this.begin(this._systemdict)
    this.begin(this._globaldict)
    this._minDictCount = this._dictionaries.length
    this._operands = new Stack(this._memoryTracker)
    this._calls = new Stack(this._memoryTracker)
  }

  // region IState

  get usedMemory (): number {
    return this._memoryTracker.used
  }

  get totalMemory (): number {
    return this._memoryTracker.total
  }

  get operands (): IArray {
    return this._operands
  }

  get dictionaries (): IArray {
    return this._dictionaries
  }

  get calls (): IArray {
    return this._calls
  }

  * parse (source: string, sourceFile?: string): Generator {
    if (this._calls.length !== 0) {
      throw new BusyParsing()
    }
    yield * this.innerParse(source, sourceFile)
  }

  // endregion IState

  get memoryTracker (): MemoryTracker {
    return this._memoryTracker
  }

  get keepDebugInfo (): boolean {
    return this._keepDebugInfo
  }

  get systemdict (): SystemDictionary {
    return this._systemdict
  }

  get globaldict (): Dictionary {
    return this._globaldict
  }

  get operandsRef (): readonly InternalValue[] {
    return this._operands.ref
  }

  get callsRef (): readonly InternalValue[] {
    return this._calls.ref
  }

  pop (): void {
    this._operands.pop()
  }

  push (value: Value): void {
    this._operands.push(value)
  }

  get dictionariesRef (): readonly InternalValue[] {
    return this._dictionaries.ref
  }

  lookup (name: string): InternalValue {
    for (const dictionaryValue of this._dictionaries.ref) {
      const dictionary = dictionaryValue.data as IDictionary
      const value = dictionary.lookup(name)
      if (value !== null) {
        return value
      }
    }
    throw new Undefined()
  }

  begin (dictionary: IDictionary): void {
    this._dictionaries.push({
      type: ValueType.dict,
      data: dictionary
    })
  }

  end (): void {
    if (this._dictionaries.ref.length === this._minDictCount) {
      throw new DictStackUnderflow()
    }
    this._dictionaries.pop()
  }

  preventCall (): void {
    ++this._noCall
  }

  allowCall (): void {
    --this._noCall
  }

  private * wrapCall (value: InternalValue, call: () => Generator): Generator {
    this._calls.push(value)
    yield // execution cycle
    try {
      yield * call.apply(this)
    } catch (e) {
      if (e instanceof BaseError) {
        e.callstack = renderCallStack(this.calls)
      }
      throw e
    } finally {
      this._calls.pop()
    }
  }

  private * evalCall (value: InternalValue): Generator {
    yield * this.wrapCall(value, function * (this: State): Generator {
      let resolvedValue = this.lookup(value.data as string)
      if (resolvedValue.type === ValueType.operator && this._keepDebugInfo) {
        resolvedValue = {
          ...value, // propagate debug infos
          ...resolvedValue
        }
      }
      yield * this.eval(resolvedValue)
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
      yield // execution cycle
      this.push(value)
    }
  }

  * eval (value: InternalValue): Generator {
    try {
      if (value.type === ValueType.proc && this._noCall === 0) {
        yield * this.evalProc(value)
      } else {
        yield * this.evalWithoutProc(value)
      }
    } catch (e) {
      if (e instanceof Break &&
        // Allowed only in a breakable operator
        !this._calls.ref.some(({ type, data }) => type === ValueType.operator && (data as OperatorFunction).breakable === true)
      ) {
        const invalidBreak = new InvalidBreak()
        invalidBreak.callstack = e.callstack
        throw invalidBreak
      }
      throw e
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

import { ValueType, IArray, IDictionary, Value, IState, StateFactorySettings } from '..'
import { Break, BusyParsing, DictStackUnderflow, InvalidBreak, Undefined } from '../errors'
import { InternalValue, OperatorFunction, parse } from '.'
import { Stack } from '../objects/Stack'
import { MemoryTracker } from './MemoryTracker'
import { Dictionary, SystemDictionary } from '../objects/dictionaries'
import { HostDictionary } from '../objects/dictionaries/Host'

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

  pop (): void {
    this._operands.pop()
  }

  push (value: Value): void {
    this._operands.push(value)
  }

  get dictionariesRef (): readonly Value[] {
    return this._dictionaries.ref
  }

  lookup (name: string): Value {
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

  private * evalCall (value: Value): Generator {
    yield // execution cycle
    this._calls.push(value)
    try {
      const resolvedValue = this.lookup(value.data as string)
      yield * this.eval(resolvedValue)
    } finally {
      this._calls.pop()
    }
  }

  private * evalOperator (value: Value): Generator {
    yield // execution cycle
    this._calls.push(value)
    try {
      const operator = value.data as OperatorFunction
      yield * operator(this)
    } finally {
      this._calls.pop()
    }
  }

  private * evalProc (value: Value): Generator {
    yield // execution cycle
    this._calls.push(value)
    try {
      const proc = value.data as IArray
      const { length } = proc
      for (let index = 0; index < length; ++index) {
        yield * this.evalWithoutProc(proc.at(index))
      }
    } finally {
      this._calls.pop()
    }
  }

  private * evalWithoutProc (value: Value): Generator {
    if (value.type === ValueType.call && (this._noCall === 0 || ['{', '}'].includes(value.data as string))) {
      yield * this.evalCall(value)
    } else if (value.type === ValueType.operator) {
      yield * this.evalOperator(value)
    } else {
      yield // execution cycle
      this.push(value)
    }
  }

  * eval (value: Value): Generator {
    try {
      if (value.type === ValueType.proc && this._noCall === 0) {
        yield * this.evalProc(value)
      } else {
        yield * this.evalWithoutProc(value)
      }
    } catch (e) {
      if (e instanceof Break && (
        this._calls.length === 0 ||
        (this._calls.length === 1 && this._calls.ref[0].type === ValueType.string)
      )) {
        throw new InvalidBreak() // TODO: forward the stack
      }
      throw e
    }
  }

  * innerParse (source: string, sourceFile?: string): Generator {
    this._calls.push({
      type: ValueType.string,
      data: source,
      untracked: true, // because external
      sourceFile
    })
    try {
      const parser = parse(source, sourceFile)
      for (const parsedValue of parser) {
        yield // parse cycle
        let value
        if (this._keepDebugInfo) {
          value = parsedValue
        } else {
          const { type, data } = parsedValue
          value = { type, data }
        }
        yield * this.eval(value)
      }
    } finally {
      this._calls.pop()
    }
  }
}

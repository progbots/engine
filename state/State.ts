import { ValueType, IArray, IDictionary, Value, IState } from '..'
import { BusyParsing, DictStackUnderflow, Undefined } from '../errors'
import { OperatorFunction, parse } from '.'
import { Stack } from '../objects/Stack'
import { MemoryTracker } from './MemoryTracker'
import { Dictionary, SystemDictionary } from '../objects/dictionaries'

export class State implements IState {
  private readonly _memoryTracker: MemoryTracker
  private readonly _systemdict: SystemDictionary = new SystemDictionary()
  private readonly _globaldict: Dictionary
  private readonly _dictionaries: Stack
  private readonly _stack: Stack
  private readonly _callStack: Value[] = []
  private _noCall: number = 0

  constructor () {
    this._memoryTracker = new MemoryTracker()
    this._dictionaries = new Stack(this._memoryTracker)
    this._globaldict = new Dictionary(this._memoryTracker)
    this.begin(this._systemdict)
    this.begin(this._globaldict)
    this._stack = new Stack(this._memoryTracker)
  }

  // region IState

  get usedMemory (): number {
    return this._memoryTracker.used
  }

  get totalMemory (): number {
    return this._memoryTracker.total
  }

  get stack (): IArray {
    return this._stack
  }

  get dictionaries (): IArray {
    return this._dictionaries
  }

  * parse (source: string): Generator {
    if (this._callStack.length !== 0) {
      throw new BusyParsing()
    }
    this._callStack.push({
      type: ValueType.string,
      data: source
    })
    const parser = parse(source)
    for (const parsedValue of parser) {
      yield // parse cycle
      yield * this.eval(parsedValue)
    }
    this._callStack.pop()
  }

  // endregion IState

  get memoryTracker (): MemoryTracker {
    return this._memoryTracker
  }

  get systemdict (): SystemDictionary {
    return this._systemdict
  }

  get globaldict (): Dictionary {
    return this._globaldict
  }

  get stackRef (): readonly Value[] {
    return this._stack.ref
  }

  pop (): void {
    this._stack.pop()
  }

  push (value: Value): void {
    this._stack.push(value)
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
    if (this._dictionaries.ref.length === 2) {
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
    this._callStack.push(value)
    const resolvedValue = this.lookup(value.data as string)
    yield * this.eval(resolvedValue)
    this._callStack.pop()
  }

  private * evalOperator (value: Value): Generator {
    this._callStack.push(value)
    const operator = value.data as OperatorFunction
    yield * operator(this)
    this._callStack.pop()
  }

  private * evalProc (value: Value): Generator {
    this._callStack.push(value)
    const proc = value.data as IArray
    const { length } = proc
    for (let index = 0; index < length; ++index) {
      yield * this.eval(proc.at(index))
    }
    this._callStack.pop()
  }

  private * eval (value: Value): Generator {
    if (value.type === ValueType.call && (this._noCall === 0 || ['{', '}'].includes(value.data as string))) {
      yield * this.evalCall(value)
    } else if (value.type === ValueType.operator) {
      yield * this.evalOperator(value)
    } else if (value.type === ValueType.proc && this._noCall === 0) {
      yield * this.evalProc(value)
    } else {
      this.push(value)
    }
    yield // execution cycle
  }
}

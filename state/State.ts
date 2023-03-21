import { ValueType, IArray, IDictionary, Value, IState } from '..'
import { DictStackUnderflow, Undefined } from '../errors'
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

  * eval (value: string): Generator {
    const parser = parse(value)
    for (const parsedValue of parser) {
      yield // parse cycle
      yield * this._eval(parsedValue)
    }
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

  private * _eval (value: Value): Generator {
    if (value.type === ValueType.call) {
      const resolvedValue = this.lookup(value.data as string)
      if (resolvedValue.type === ValueType.operator) {
        const operator = resolvedValue.data as OperatorFunction
        yield * operator(this)
      } else {
        this.push(resolvedValue)
      }
    } else {
      this.push(value)
    }
    yield // execution cycle
  }
}

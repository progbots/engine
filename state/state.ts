import { IDictionary, IState, OperatorFunction, StateMemory, Value, ValueType } from '../types'
import { DictStackUnderflow, Undefined } from '../errors'
import { parse, Stack, MemoryTracker } from '.'
import { SystemDictionary } from '../dictionaries'

export class State implements IState {
  private readonly _dictionaries: Stack
  private readonly _stack: Stack
  private readonly _memoryTracker: MemoryTracker

  constructor () {
    this._memoryTracker = new MemoryTracker()
    this._dictionaries = new Stack(this._memoryTracker)
    this.begin(new SystemDictionary())
    this._stack = new Stack(this._memoryTracker)
  }

  memory (): StateMemory {
    const { used, total } = this._memoryTracker
    return {
      used,
      total
    }
  }

  stackRef (): readonly Value[] {
    return this._stack.ref
  }

  pop (): void {
    this._stack.pop()
  }

  push (value: Value): void {
    this._stack.push(value)
  }

  * dictionaries (): Generator<IDictionary> {
    for (const value of this._dictionaries) {
      yield value.data as IDictionary
    }
  }

  lookup (name: string): Value {
    for (const dictionary of this.dictionaries()) {
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
    if (this._dictionaries.ref.length === 1) {
      throw new DictStackUnderflow()
    }
    this._dictionaries.pop()
  }

  private * _eval (value: Value): Generator<void> {
    if (value.type === ValueType.name) {
      const resolvedValue = this.lookup(value.data as string)
      if (resolvedValue.type === ValueType.operator) {
        const operator = resolvedValue.data as OperatorFunction
        const result = operator(this)
        if (result !== undefined) {
          yield * result
        }
      } else {
        this.push(resolvedValue)
      }
    } else {
      this.push(value)
    }
    yield // execution cycle
  }

  * eval (value: Value | string): Generator<void> {
    if (typeof value === 'string') {
      const parser = parse(value, this)
      for (const parsedValue of parser) {
        yield // parse cycle
        yield * this._eval(parsedValue)
      }
    } else {
      yield * this._eval(value)
    }
  }
}

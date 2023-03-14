import { IDictionary, IState, OperatorFunction, StateMemory, Value, ValueType } from './types'
import { StackUnderflow, Undefined } from './errors'
import { SystemDictionary } from './dictionaries'
import { parse } from './parser'

export function cycles (iterator: Generator<void>): number {
  let count = 0
  let { done } = iterator.next()
  while (done === false) {
    ++count
    done = iterator.next().done
  }
  return count
}

const STACK_SLOT_BYTES = 4
const VALUE_TYPE_BYTES = 1

const stringSizer = (data: string): number => {
  const encoder = new TextEncoder()
  const buffer = encoder.encode(data as string)
  return buffer.length + 1 // terminal 0
}

const sizers: Record<ValueType, (value: Value) => number> = {
  [ValueType.integer]: () => 4,
  [ValueType.string]: (value) => stringSizer(value.data as string),
  [ValueType.name]: (value) => stringSizer(value.data as string),
  [ValueType.operator]: () => 0, // considered ROM
  [ValueType.array]: (value) => (value.data as Value[]).reduce((sum: number, subValue: Value) => sum + size(subValue), 0),
  [ValueType.dict]: (value) => {
    const dictionary = value.data as IDictionary
    if (dictionary instanceof SystemDictionary) {
      return 0 // considered ROM
    }
    const keys = dictionary.keys()
    return keys.reduce((sum: number, key: string) => sum + stringSizer(key) + size(dictionary.lookup(key) as Value), 0)
  }
}

function size (value: Value) {
  return VALUE_TYPE_BYTES + sizers[value.type](value)
}

export class State implements IState {
  private readonly _dictionaries: IDictionary[] = [
    new SystemDictionary()
  ]

  private readonly _stack: Value[] = []

  private _bytes: number = 0;

  memory (): StateMemory {
    return {
      used: this._bytes,
      total: Infinity
    }
  }

  stack (): readonly Value[] {
    return this._stack
  }

  pop (): void {
    if (this._stack.length === 0) {
      throw new StackUnderflow()
    }
    const value = this._stack[0]
    this._bytes -= size(value) + STACK_SLOT_BYTES;
    this._stack.shift()
  }

  push (value: Value): void {
    this._bytes += size(value) + STACK_SLOT_BYTES;
    this._stack.unshift(value)
  }

  dictionaries (): readonly IDictionary[] {
    return this._dictionaries
  }

  lookup (name: string): Value {
    for (const dictionary of this._dictionaries) {
      const value = dictionary.lookup(name)
      if (value !== null) {
        return value
      }
    }
    throw new Undefined()
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

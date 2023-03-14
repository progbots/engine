import { IDictionary, IState, OperatorFunction, Value, ValueType } from './types'
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

export class State implements IState {
  private readonly _dictionaries: IDictionary[] = [
    new SystemDictionary()
  ]

  private readonly _stack: Value[] = []

  stack (): readonly Value[] {
    return this._stack
  }

  pop (): void {
    if (this._stack.length === 0) {
      throw new StackUnderflow()
    }
    this._stack.shift()
  }

  push (value: Value): void {
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

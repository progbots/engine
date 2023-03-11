import { IContext, IState, OperatorFunction, Value, ValueType } from './types'
import { Busy, RangeCheck, StackUnderflow, TypeCheck, Undefined } from './errors'
import { RootContext } from './contexts'

export function checkStack (state: IState, ...types: ValueType[]): Value[] {
  return types.map((type: ValueType, pos: number): Value => {
    const value = state.index(pos)
    if (value.type !== type) {
      throw new TypeCheck()
    }
    return value
  })
}

export class State implements IState {
  private readonly _contexts: IContext[] = [
    new RootContext()
  ]

  constructor (
    private readonly _stack: Value[] = []
  ) {}

  count (): number {
    return this._stack.length
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

  index (pos: number): Value {
    if (pos >= this._stack.length) {
      throw new StackUnderflow()
    }
    if (pos < 0) {
      throw new RangeCheck()
    }
    return this._stack[pos]
  }

  contexts (): IContext[] {
    return [...this._contexts]
  }

  lookup (name: string): Value {
    for (const context of this._contexts) {
      const value = context.lookup(name)
      if (value !== null) {
        return value
      }
    }
    throw new Undefined()
  }
}

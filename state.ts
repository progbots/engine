import { IContext, IState, Value, ValueType } from './types'
import { RangeCheck, StackUnderflow, TypeCheck, Undefined } from './errors'
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
  private readonly contexts: IContext[] = [
    new RootContext()
  ]

  constructor (
    private readonly stack: Value[] = []
  ) {}

  count (): number {
    return this.stack.length
  }

  pop (): void {
    if (this.stack.length === 0) {
      throw new StackUnderflow()
    }
    this.stack.shift()
  }

  push (value: Value): void {
    this.stack.unshift(value)
  }

  index (pos: number): Value {
    if (pos >= this.stack.length) {
      throw new StackUnderflow()
    }
    if (pos < 0) {
      throw new RangeCheck()
    }
    return this.stack[pos]
  }

  lookup (name: string): Value {
    for (const context of this.contexts) {
      const value = context.lookup(name)
      if (value !== null) {
        return value
      }
    }
    throw new Undefined()
  }
}

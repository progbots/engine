import { IState, Value, ValueType } from './types'
import { StackUnderflow, TypeCheck } from './errors'

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
    return this.stack[pos]
  }
}

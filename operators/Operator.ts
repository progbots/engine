import { State, ValueType } from '../types'
import { StackUnderflow, TypeCheck } from '../errors'

export abstract class Operator {
  checkStack (state: State, ...types: ValueType[]) {
    const { stack } = state
    if (types.length > stack.length) {
      throw new StackUnderflow()
    }
    types.forEach((type, index) => {
      if (stack[index].type !== type) {
        throw new TypeCheck()
      }
    })
  }

  abstract evaluate (state: State): void
}

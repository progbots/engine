import { IState, Value, ValueType } from '../types'
import { StackUnderflow, TypeCheck } from '../errors'

export function checkStack (state: IState, ...types: ValueType[]): Value[] {
  const stack = state.stack()
  if (types.length > stack.length) {
    throw new StackUnderflow()
  }
  return types.map((type: ValueType, pos: number): Value => {
    const value = stack[pos]
    if (value.type !== type) {
      throw new TypeCheck()
    }
    return value
  })
}

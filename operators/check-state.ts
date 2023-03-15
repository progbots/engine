import { IState, Value, ValueType } from '../types'
import { StackUnderflow, TypeCheck } from '../errors'

export function checkStack (state: IState, ...types: Array<ValueType | null>): Value[] {
  const stack = state.stackRef()
  if (types.length > stack.length) {
    throw new StackUnderflow()
  }
  return types.map((type: ValueType | null, pos: number): Value => {
    const value = stack[pos]
    if (type !== null && value.type !== type) {
      throw new TypeCheck()
    }
    return value
  })
}

import { InternalValue, State } from '../state'
import { ValueType } from '..'
import { StackUnderflow, TypeCheck } from '../errors'

export function checkStack (state: State, ...types: Array<ValueType | null>): InternalValue[] {
  const stack = state.stackRef
  if (types.length > stack.length) {
    throw new StackUnderflow()
  }
  return types.map((type: ValueType | null, pos: number): InternalValue => {
    const value = stack[pos]
    if (type !== null && value.type !== type) {
      throw new TypeCheck()
    }
    return value
  })
}

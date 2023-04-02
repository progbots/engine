import { InternalValue, State } from '../state'
import { ValueType } from '..'
import { StackUnderflow, TypeCheck, UnmatchedMark } from '../errors'

export function checkOperands (state: State, ...types: Array<ValueType | null>): InternalValue[] {
  const operands = state.operandsRef
  if (types.length > operands.length) {
    throw new StackUnderflow()
  }
  return types.map((type: ValueType | null, pos: number): InternalValue => {
    const value = operands[pos]
    if (type !== null && value.type !== type) {
      throw new TypeCheck()
    }
    return value
  })
}

export function findMarkPos (state: State): number {
  const pos = state.operandsRef.findIndex((value: InternalValue) => value.type === ValueType.mark)
  if (pos === -1) {
    throw new UnmatchedMark()
  }
  return pos
}

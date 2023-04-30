import { InternalValue, State } from '../state/index'
import { ValueType } from '../index'
import { StackUnderflow, TypeCheck, UnmatchedMark } from '../errors/index'

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

export function spliceOperands (state: State, count: number, ...values: InternalValue[]): void {
  if (state.operandsRef.length < count) {
    throw new StackUnderflow()
  }
  for (let index = 0; index < count; ++index) {
    state.pop()
  }
  for (const value of values) {
    state.push(value)
  }
}

export function findMarkPos (state: State): number {
  const pos = state.operandsRef.findIndex((value: InternalValue) => value.type === ValueType.mark)
  if (pos === -1) {
    throw new UnmatchedMark()
  }
  return pos
}

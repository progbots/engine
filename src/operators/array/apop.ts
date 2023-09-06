import { CycleResult, IInternalState, InternalValue } from '@sdk'
import { RangeCheck } from '@errors'
import { setOperatorAttributes } from '@operators/attributes'
import { extractValueArray } from './extract-array'

export function apop ({ operands }: IInternalState, operand: InternalValue): CycleResult {
  const array = extractValueArray(operand)
  const value = array.ref.at(-1)
  if (value === undefined) {
    throw new RangeCheck()
  }
  array.pop()
  operands.splice(1, value)
  return null
}

setOperatorAttributes<null>(apop, {
  typeCheck: [null]
})

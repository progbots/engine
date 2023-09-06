import { CycleResult, IInternalState, InternalValue } from '@sdk'
import { setOperatorAttributes } from '@operators/attributes'
import { extractValueArray } from './extract-array'

export function apush ({ operands }: IInternalState, operand: InternalValue, value: InternalValue): CycleResult {
  const array = extractValueArray(operand)
  array.push(value)
  operands.splice(2)
  return null
}

setOperatorAttributes<null, null>(apush, {
  typeCheck: [null, null]
})

import { getIArrayValues } from '@api'
import { InternalValue, CycleResult, IInternalState } from '@sdk'
import { setOperatorAttributes } from '@operators/attributes'
import { extractArray } from './extract-array'

export function aload ({ operands }: IInternalState, operand: InternalValue): CycleResult {
  const array = extractArray(operand)
  operands.pop()
  for (const value of getIArrayValues(array)) {
    operands.push(value)
  }
  return null
}

setOperatorAttributes(aload, {
  typeCheck: [null]
})

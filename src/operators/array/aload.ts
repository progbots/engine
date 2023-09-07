import { getIArrayValues } from '@api'
import { InternalValue, CycleResult, IInternalState } from '@sdk'
import { setOperatorAttributes } from '@operators/attributes'
import { extractIArray } from './extract-array'

export function aload ({ operands }: IInternalState, operand: InternalValue): CycleResult {
  const array = extractIArray(operand)
  operands.pop()
  for (const value of getIArrayValues(array)) {
    operands.push(value)
  }
  return null
}

setOperatorAttributes(aload, {}, null)

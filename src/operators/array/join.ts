import { ArrayValue, ValueType, checkStringValue, getIArrayValues } from '@api'
import { CycleResult, IInternalState, Internal } from '@sdk'
import { TypeCheck } from '@errors'
import { setOperatorAttributes } from '@operators/attributes'
import { extractIArray } from './extract-array'

export function join ({ operands }: IInternalState, operand: Internal<ArrayValue>): CycleResult {
  const array = extractIArray(operand)
  const strings = []
  try {
    for (const value of getIArrayValues(array)) {
      checkStringValue(value)
      strings.push(value.string)
    }
  } catch (e) {
    throw new TypeCheck()
  }
  operands.splice(1, {
    type: ValueType.string,
    string: strings.join('')
  })
  return null
}

setOperatorAttributes(join, {}, ValueType.array)

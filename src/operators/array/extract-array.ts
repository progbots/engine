import { IArray, ValueType } from '@api';
import { InternalValue } from '@sdk'
import { TypeCheck } from '@errors'
import { ValueArray } from '@objects/ValueArray';

export function extractArray (operand: InternalValue): IArray {
  const { type } = operand
  let array: IArray
  if (type === ValueType.array) {
    array = operand.array
  } else if (type === ValueType.block) {
    array = operand.block
  } else {
    throw new TypeCheck()
  }
  return array
}

export function extractValueArray (operand: InternalValue): ValueArray {
  const array = extractArray(operand)
  try {
    ValueArray.check(array)
    return array
  } catch (e) {
    throw new TypeCheck()
  }
}
import { State, InternalValue, AtomicResult } from '../../state/index'
import { ValueType } from '../../index'
import { TypeCheck } from '../../errors/index'
import { ArrayLike } from '../../objects/Array'
import { setOperatorAttributes } from '../attributes'

export function aload ({ operands }: State, [{ type, data }]: readonly InternalValue[]): AtomicResult {
  if (![ValueType.array, ValueType.block, ValueType.proc].includes(type)) {
    throw new TypeCheck()
  }
  const array = data as unknown as ArrayLike
  const { length } = array
  operands.pop()
  for (let index = 0; index < length; ++index) {
    const value = array.at(index)
    operands.push(value)
  }
  return null
}

setOperatorAttributes(aload, {
  typeCheck: [null]
})

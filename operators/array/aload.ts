import { State, InternalValue, CycleResult, checkIArray } from '../../state/index'
import { ValueType } from '../../index'
import { TypeCheck } from '../../errors/index'
import { setOperatorAttributes } from '../attributes'

/* eslint-disable no-labels */

export function aload ({ operands }: State, [{ type, data }]: readonly InternalValue[]): CycleResult {
  if (![ValueType.array, ValueType.block, ValueType.proc].includes(type)) {
    throw new TypeCheck()
  }
  assert: checkIArray(data)
  const { length } = data
  operands.pop()
  for (let index = 0; index < length; ++index) {
    const value = data.at(index)
    operands.push(value)
  }
  return null
}

setOperatorAttributes(aload, {
  typeCheck: [null]
})

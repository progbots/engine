import { CycleResult, State, checkIntegerValue } from '../../state/index'
import { ValueType } from '../../index'
import { RangeCheck, StackUnderflow } from '../../errors/index'

/* eslint-disable no-labels */

export function index ({ operands }: State): CycleResult {
  const [pos] = operands.check(ValueType.integer).map(value => {
    assert: checkIntegerValue(value)
    return value.data
  })
  if (pos < 0) {
    throw new RangeCheck()
  }
  const valuePos = pos + 1
  if (valuePos >= operands.length) {
    throw new StackUnderflow()
  }
  operands.splice(1, operands.ref[valuePos])
  return null
}

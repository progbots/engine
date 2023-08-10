import { RangeCheck } from '../../src/errors/index'
import { ValueType } from '../../index'
import { CycleResult, State, checkIntegerValue } from '../../state/index'

/* eslint-disable no-labels */

export function roll ({ operands }: State): CycleResult {
  const [steps, size] = operands.check(ValueType.integer, ValueType.integer).map(value => {
    assert: checkIntegerValue(value)
    return value.data
  })
  if (size <= 0) {
    throw new RangeCheck()
  }
  const values = operands.ref.slice(2, 2 + size).reverse()
  const rolledValues = [...values, ...values]
  const from = (size - steps) % size
  operands.splice(2 + size,
    // Stryker disable next-line ArithmeticOperator: replacing + with - leads to equivalent result
    rolledValues.slice(from, from + size))
  return null
}

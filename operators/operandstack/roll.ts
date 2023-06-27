import { RangeCheck } from '../../errors/index'
import { ValueType } from '../../index'
import { State } from '../../state/index'

export function roll ({ operands }: State): undefined {
  const [steps, size] = operands.check(ValueType.integer, ValueType.integer).map(value => value.data as number)
  if (size <= 0) {
    throw new RangeCheck()
  }
  const values = operands.ref.slice(2, 2 + size).reverse()
  const rolledValues = [...values, ...values]
  const from = (size - steps) % size
  operands.splice(2 + size,
    // Stryker disable next-line ArithmeticOperator: replacing + with - leads to equivalent result
    rolledValues.slice(from, from + size))
}

import { ValueType } from '../index'
import { State } from '../state/index'

export function * roll ({ operands }: State): Generator {
  const [steps, size] = operands.check(ValueType.integer, ValueType.integer).map(value => value.data as number)
  const values = operands.ref.slice(2, 2 + size).reverse()
  const rolledValues = []
  for (let index = 0; index < size; ++index) {
    rolledValues.push(values[(size + index - steps) % size])
  }
  operands.splice(2 + size, rolledValues)
}

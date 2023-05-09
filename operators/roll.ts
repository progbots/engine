import { ValueType } from '../index'
import { State } from '../state/index'
import { ShareableObject } from '../objects/ShareableObject'

export function * roll ({ operands }: State): Generator {
  const [steps, size] = operands.check(ValueType.integer, ValueType.integer).map(value => value.data as number)
  const values = operands.ref.slice(2, 2 + size).reverse()
  ShareableObject.addRef(values) // TODO: does not work for strings
  try {
    operands.splice(2 + size)
    for (let index = 0; index < size; ++index) {
      operands.push(values[(size + index - steps) % size])
    }
  } finally {
    ShareableObject.release(values)
  }
}

import { ValueType } from '../index'
import { State } from '../state/index'

export function * neq ({ operands }: State): Generator {
  const [value1, value2] = operands.check(null, null)
  const result = value1.type !== value2.type || value1.data !== value2.data
  operands.splice(2, {
    type: ValueType.boolean,
    data: result
  })
}

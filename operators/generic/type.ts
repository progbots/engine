import { ValueType } from '../../index'
import { State } from '../../state/index'

export function * type ({ operands }: State): Generator {
  const [{ type }] = operands.check(null)
  operands.splice(1, {
    type: ValueType.string,
    data: type
  })
}

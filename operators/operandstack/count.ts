import { ValueType } from '../../index'
import { State } from '../../state/index'

export function * count ({ operands }: State): Generator {
  operands.push({
    type: ValueType.integer,
    data: operands.length
  })
}

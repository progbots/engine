import { ValueType } from '../../index'
import { State } from '../../state/index'

export function count ({ operands }: State): undefined {
  operands.push({
    type: ValueType.integer,
    data: operands.length
  })
}

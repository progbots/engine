import { ValueType } from '../../index'
import { State } from '../../state/index'

export function counttomark ({ operands }: State): undefined {
  operands.push({
    type: ValueType.integer,
    data: operands.findMarkPos()
  })
}

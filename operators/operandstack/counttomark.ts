import { ValueType } from '../../index'
import { State } from '../../state/index'

export function counttomark ({ operands }: State): void {
  operands.push({
    type: ValueType.integer,
    data: operands.findMarkPos()
  })
}

import { State } from '../../state/index'
import { ValueType } from '../../index'

export function mark ({ operands }: State): void {
  operands.push({
    type: ValueType.mark,
    data: null
  })
}

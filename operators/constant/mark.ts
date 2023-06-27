import { State } from '../../state/index'
import { ValueType } from '../../index'

export function mark ({ operands }: State): undefined {
  operands.push({
    type: ValueType.mark,
    data: null
  })
}

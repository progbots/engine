import { State } from '../state/index'
import { ValueType } from '../index'

export function * mark ({ operands }: State): Generator {
  operands.push({
    type: ValueType.mark,
    data: null
  })
}

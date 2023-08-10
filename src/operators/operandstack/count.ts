import { ValueType } from '../../index'
import { CycleResult, State } from '../../state/index'

export function count ({ operands }: State): CycleResult {
  operands.push({
    type: ValueType.integer,
    data: operands.length
  })
  return null
}

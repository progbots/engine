import { ValueType } from '../../index'
import { CycleResult, State } from '../../state/index'

export function counttomark ({ operands }: State): CycleResult {
  operands.push({
    type: ValueType.integer,
    data: operands.findMarkPos()
  })
  return null
}

import { ValueType } from '../../index'
import { AtomicResult, State } from '../../state/index'

export function counttomark ({ operands }: State): AtomicResult {
  operands.push({
    type: ValueType.integer,
    data: operands.findMarkPos()
  })
  return null
}

import { ValueType } from '../../index'
import { AtomicResult, State } from '../../state/index'

export function count ({ operands }: State): AtomicResult {
  operands.push({
    type: ValueType.integer,
    data: operands.length
  })
  return null
}

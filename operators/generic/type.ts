import { ValueType } from '../../index'
import { AtomicResult, State } from '../../state/index'

export function type ({ operands }: State): AtomicResult {
  const [{ type }] = operands.check(null)
  operands.splice(1, {
    type: ValueType.string,
    data: type
  })
  return null
}

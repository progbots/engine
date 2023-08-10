import { ValueType } from '../../index'
import { CycleResult, State } from '../../state/index'

export function type ({ operands }: State): CycleResult {
  const [{ type }] = operands.check(null)
  operands.splice(1, {
    type: ValueType.string,
    data: type
  })
  return null
}

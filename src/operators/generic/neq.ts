import { ValueType } from '../../index'
import { CycleResult, State } from '../../state/index'

export function neq ({ operands }: State): CycleResult {
  const [value1, value2] = operands.check(null, null)
  operands.splice(2, {
    type: ValueType.boolean,
    data: value1.type !== value2.type || value1.data !== value2.data
  })
  return null
}

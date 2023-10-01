import { ValueType, valueOf } from '@api'
import { CycleResult, IInternalState } from '@sdk'

export function neq ({ operands }: IInternalState): CycleResult {
  const [value1, value2] = operands.check(null, null)
  operands.splice(2, {
    type: ValueType.boolean,
    isSet: value1.type !== value2.type || valueOf(value1) !== valueOf(value2)
  })
  return null
}

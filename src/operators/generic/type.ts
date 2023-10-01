import { ValueType } from '@api'
import { CycleResult, IInternalState } from '@sdk'

export function type ({ operands }: IInternalState): CycleResult {
  const [{ type }] = operands.check(null)
  operands.splice(1, {
    type: ValueType.string,
    string: type
  })
  return null
}

import { CycleResult, IInternalState } from '@sdk/index'

export function clear ({ operands }: IInternalState): CycleResult {
  operands.splice(operands.length)
  return null
}

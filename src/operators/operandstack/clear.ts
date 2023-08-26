import { CycleResult, IInternalState } from '@sdk'

export function clear ({ operands }: IInternalState): CycleResult {
  operands.splice(operands.length)
  return null
}

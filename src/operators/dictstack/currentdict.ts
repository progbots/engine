import { CycleResult, IInternalState } from '@sdk'

export function currentdict ({ operands, dictionaries }: IInternalState): CycleResult {
  operands.push(dictionaries.top)
  return null
}

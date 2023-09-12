import { ValueType } from '@api'
import { CycleResult, IInternalState } from '@sdk'

export function globaldict ({ operands, dictionaries }: IInternalState): CycleResult {
  operands.push({
    type: ValueType.dictionary,
    dictionary: dictionaries.global
  })
  return null
}

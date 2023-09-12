import { ValueType } from '@api'
import { CycleResult, IInternalState } from '@sdk'

export function systemdict ({ operands, dictionaries }: IInternalState): CycleResult {
  operands.push({
    type: ValueType.dictionary,
    dictionary: dictionaries.system
  })
  return null
}

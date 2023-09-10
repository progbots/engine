import { ValueType } from '@api'
import { CycleResult, IInternalState, scanIWritableDictionary } from '@sdk'

export function def ({ operands, dictionaries }: IInternalState): CycleResult {
  const [value, { string }] = operands.check(null, ValueType.string)
  const { dictionary } = dictionaries.top
  scanIWritableDictionary(dictionary)
  dictionary.def(string, value)
  operands.splice(2)
  return null
}

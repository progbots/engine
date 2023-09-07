import { DictionaryValue, ValueType } from '@api'
import { CycleResult, IInternalState, Internal } from 'sdk'
import { setOperatorAttributes } from '@operators/attributes'

export function begin ({ operands, dictionaries }: IInternalState, dictionary: Internal<DictionaryValue>): CycleResult {
  dictionaries.begin(dictionary.dictionary)
  operands.pop()
  return null
}

setOperatorAttributes(begin, {}, ValueType.dictionary)

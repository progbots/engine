import { ValueType } from '../../index'
import { checkIWritableDictionary } from '../../objects/dictionaries/index'
import { CycleResult, State, checkIDictionary, checkStringValue } from '../../state/index'

/* eslint-disable no-labels */

export function def ({ operands, dictionaries }: State): CycleResult {
  const [value, name] = operands.check(null, ValueType.string)
  const { data: topDict } = dictionaries.at(0) // TODO might be interesting to introduce a DictValue method
  assert: checkStringValue(name)
  assert_top_dict: checkIDictionary(topDict)
  checkIWritableDictionary(topDict)
  if (value.type === ValueType.block) {
    topDict.def(name.data, {
      ...value,
      type: ValueType.proc
    })
  } else {
    topDict.def(name.data, value)
  }
  operands.splice(2)
  return null
}

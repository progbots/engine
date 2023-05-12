import { ValueType, IDictionary } from '../index'
import { checkIWritableDictionary } from '../objects/dictionaries/index'
import { State } from '../state/index'

export function * def ({ operands, dictionaries }: State): Generator {
  const [value, name] = operands.check(null, ValueType.string)
  const { data: top } = dictionaries.at(0)
  const topDict = top as IDictionary
  checkIWritableDictionary(topDict)
  topDict.def(name.data as string, value)
  operands.splice(2)
}

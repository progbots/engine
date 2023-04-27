import { ValueType, IDictionary } from '../index'
import { checkIWritableDictionary } from '../objects/dictionaries/index'
import { State } from '../state/index'
import { checkOperands, spliceOperands } from './operands'

export function * def (state: State): Generator {
  const [value, name] = checkOperands(state, null, ValueType.string)
  const [{ data: top }] = state.dictionariesRef
  const topDict = top as IDictionary
  checkIWritableDictionary(topDict)
  topDict.def(name.data as string, value)
  spliceOperands(state, 2)
}

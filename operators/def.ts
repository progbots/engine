import { ValueType } from '../index'
import { IWritableDictionary } from '../objects/dictionaries/index'
import { State } from '../state/index'
import { checkOperands } from './operands'

export function * def (state: State): Generator {
  const [value, name] = checkOperands(state, null, ValueType.name)
  const [{ data: top }] = state.dictionariesRef
  const topDict = top as IWritableDictionary
  topDict.def(name.data as string, value)
  state.pop()
  state.pop()
}

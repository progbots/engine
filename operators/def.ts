import { ValueType } from '..'
import { IWritableDictionary } from '../objects/dictionaries'
import { State } from '../state'
import { checkOperands } from './operands'

export function * def (state: State): Generator {
  const [value, name] = checkOperands(state, null, ValueType.name)
  const [{ data: top }] = state.dictionariesRef
  const topDict = top as IWritableDictionary
  topDict.def(name.data as string, value)
  state.pop()
  state.pop()
}

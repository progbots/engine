import { ValueType } from '..'
import { IWritableDictionary } from '../objects/dictionaries'
import { State } from '../state'
import { checkStack } from './check-state'

export function * def (state: State): Generator {
  checkStack(state, null, ValueType.name)
  const [value, name] = state.stackRef
  const [{ data: top }] = state.dictionariesRef
  const topDict = top as IWritableDictionary
  topDict.def(name.data as string, value)
  state.pop()
  state.pop()
}

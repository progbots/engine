import { IDictionary, ValueType } from '..'
import { State } from '../state'
import { checkStack } from './check-state'

export function * begin (state: State): Generator {
  const [dict] = checkStack(state, ValueType.dict)
  state.begin(dict.data as IDictionary)
  state.pop()
}

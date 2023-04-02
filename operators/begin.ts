import { IDictionary, ValueType } from '..'
import { State } from '../state'
import { checkOperands } from './operands'

export function * begin (state: State): Generator {
  const [dict] = checkOperands(state, ValueType.dict)
  state.begin(dict.data as IDictionary)
  state.pop()
}

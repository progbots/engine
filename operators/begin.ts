import { IDictionary, ValueType } from '../index'
import { State } from '../state/index'
import { checkOperands } from './operands'

export function * begin (state: State): Generator {
  const [dict] = checkOperands(state, ValueType.dict)
  state.begin(dict.data as IDictionary)
  state.pop()
}

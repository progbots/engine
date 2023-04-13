import { State } from '../state/index'
import { checkOperands } from './operands'

export function * dup (state: State): Generator {
  const [value] = checkOperands(state, null)
  state.push(value)
}

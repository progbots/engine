import { State } from '../state'
import { checkOperands } from './operands'

export function * pop (state: State): Generator {
  checkOperands(state, null)
  state.pop()
}

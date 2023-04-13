import { State } from '../state/index'
import { checkOperands } from './operands'

export function * pop (state: State): Generator {
  checkOperands(state, null)
  state.pop()
}

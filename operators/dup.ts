import { State } from '../state'
import { checkStack } from './check-state'

export function * dup (state: State): Generator {
  checkStack(state, null)
  const [value] = state.stackRef
  state.push(value)
}

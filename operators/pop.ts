import { State } from '../state'
import { checkStack } from './check-state'

export function * pop (state: State): Generator {
  checkStack(state, null)
  state.pop()
}

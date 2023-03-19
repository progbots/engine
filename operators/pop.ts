import { State } from '../state'
import { checkStack } from './check-state'

export function pop (state: State): void {
  checkStack(state, null)
  state.pop()
}

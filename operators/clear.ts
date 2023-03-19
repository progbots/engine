import { State } from '../state'

export function * clear (state: State): Generator {
  const stack = state.stackRef
  while (stack.length > 0) {
    state.pop()
  }
}

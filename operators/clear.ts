import { State } from '../state/index'

export function * clear (state: State): Generator {
  const stack = state.operandsRef
  while (stack.length > 0) {
    state.pop()
  }
}

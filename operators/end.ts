import { State } from '../state'

export function * end (state: State): Generator {
  state.end()
}

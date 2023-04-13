import { State } from '../state/index'

export function * end (state: State): Generator {
  state.end()
}

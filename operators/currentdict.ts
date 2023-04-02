import { State } from '../state'

export function * currentdict (state: State): Generator {
  state.push(state.dictionariesRef[0])
}

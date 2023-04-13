import { State } from '../state/index'

export function * currentdict (state: State): Generator {
  state.push(state.dictionariesRef[0])
}

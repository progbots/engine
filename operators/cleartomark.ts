import { State } from '../state/index'
import { findMarkPos } from './operands'

export function * cleartomark (state: State): Generator {
  let pos = findMarkPos(state)
  while (pos >= 0) {
    state.pop()
    --pos
  }
}

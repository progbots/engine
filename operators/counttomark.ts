import { ValueType } from '..'
import { State } from '../state'
import { findMarkPos } from './operands'

export function * counttomark (state: State): Generator {
  const pos = findMarkPos(state)
  state.push({
    type: ValueType.integer,
    data: pos
  })
}

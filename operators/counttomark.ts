import { ValueType } from '../index'
import { State } from '../state/index'
import { findMarkPos } from './operands'

export function * counttomark (state: State): Generator {
  state.push({
    type: ValueType.integer,
    data: findMarkPos(state)
  })
}

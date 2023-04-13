import { ValueType } from '../index'
import { State } from '../state/index'

export function * count (state: State): Generator {
  state.push({
    type: ValueType.integer,
    data: state.operandsRef.length
  })
}

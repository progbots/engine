import { ValueType } from '..'
import { State } from '../state'

export function * count (state: State): Generator {
  state.push({
    type: ValueType.integer,
    data: state.operandsRef.length
  })
}

import { ValueType } from '..'
import { State } from '../state'

export function * globaldict (state: State): Generator {
  state.push({
    type: ValueType.dict,
    data: state.globaldict
  })
}

import { ValueType } from '../index'
import { State } from '../state/index'

export function * globaldict (state: State): Generator {
  state.push({
    type: ValueType.dict,
    data: state.globaldict
  })
}

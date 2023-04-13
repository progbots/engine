import { ValueType } from '../index'
import { State } from '../state/index'

export function * systemdict (state: State): Generator {
  state.push({
    type: ValueType.dict,
    data: state.systemdict
  })
}

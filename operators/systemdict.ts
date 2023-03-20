import { ValueType } from '..'
import { State } from '../state'

export function * systemdict (state: State): Generator {
  state.push({
    type: ValueType.dict,
    data: state.systemdict
  })
}

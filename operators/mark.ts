import { State } from '../state/index'
import { ValueType } from '../index'

export function * mark (state: State): Generator {
  state.push({
    type: ValueType.mark,
    data: null
  })
}

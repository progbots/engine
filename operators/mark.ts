import { State } from '../state'
import { ValueType } from '..'

export function * mark (state: State): Generator {
  state.push({
    type: ValueType.mark,
    data: null
  })
}

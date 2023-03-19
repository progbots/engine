import { State } from '../state'
import { ValueType } from '../types'

export function mark (state: State): void {
  state.push({
    type: ValueType.mark,
    data: null
  })
}

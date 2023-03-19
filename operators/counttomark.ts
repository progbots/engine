import { State } from '../state'
import { UnmatchedMark } from '../errors'
import { Value, ValueType } from '../types'

export function counttomark (state: State): void {
  const pos = state.stackRef().findIndex((value: Value) => value.type === ValueType.mark)
  if (pos === -1) {
    throw new UnmatchedMark()
  }
  state.push({
    type: ValueType.integer,
    data: pos
  })
}

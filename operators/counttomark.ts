import { State } from '../state'
import { UnmatchedMark } from '../errors'
import { Value, ValueType } from '..'

export function * counttomark (state: State): Generator {
  const pos = state.stackRef.findIndex((value: Value) => value.type === ValueType.mark)
  if (pos === -1) {
    throw new UnmatchedMark()
  }
  state.push({
    type: ValueType.integer,
    data: pos
  })
}

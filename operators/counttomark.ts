import { InternalValue, State } from '../state'
import { UnmatchedMark } from '../errors'
import { ValueType } from '..'

export function * counttomark (state: State): Generator {
  const pos = state.stackRef.findIndex((value: InternalValue) => value.type === ValueType.mark)
  if (pos === -1) {
    throw new UnmatchedMark()
  }
  state.push({
    type: ValueType.integer,
    data: pos
  })
}

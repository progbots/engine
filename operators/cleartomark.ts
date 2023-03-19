import { State } from '../state'
import { UnmatchedMark } from '../errors'
import { Value, ValueType } from '..'

export function * cleartomark (state: State): Generator {
  let pos = state.stackRef.findIndex((value: Value) => value.type === ValueType.mark)
  if (pos === -1) {
    throw new UnmatchedMark()
  }
  while (pos >= 0) {
    state.pop()
    --pos
  }
}

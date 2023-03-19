import { UnmatchedMark } from '../errors'
import { IState, Value, ValueType } from '../types'

export function cleartomark (state: IState): void {
  let pos = state.stackRef().findIndex((value: Value) => value.type === ValueType.mark)
  if (pos === -1) {
    throw new UnmatchedMark()
  }
  while (pos >= 0) {
    state.pop()
    --pos
  }
}

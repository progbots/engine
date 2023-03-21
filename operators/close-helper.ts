import { Value, ValueType } from '..'
import { UnmatchedMark } from '../errors'
import { ArrayLike } from '../objects/Array'
import { State } from '../state'

export function closeToMark (state: State, type: ValueType.array | ValueType.proc): void {
  const stack = state.stackRef
  const markPos = stack.findIndex((value: Value) => value.type === ValueType.mark)
  if (markPos === -1) {
    throw new UnmatchedMark()
  }
  const array = new ArrayLike(state.memoryTracker)
  let index: number
  for (index = 0; index < markPos; ++index) {
    array.unshift(stack[index])
  }
  for (index = 0; index <= markPos; ++index) {
    state.pop()
  }
  state.push({
    type,
    data: array
  })
  array.release()
}

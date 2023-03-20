import { State } from '../state'
import { UnmatchedMark } from '../errors'
import { Array } from '../objects/Array'
import { Value, ValueType } from '..'

export function * closeArray (state: State): Generator {
  const stack = state.stackRef
  const markPos = stack.findIndex((value: Value) => value.type === ValueType.mark)
  if (markPos === -1) {
    throw new UnmatchedMark()
  }
  const array = new Array(state.memoryTracker)
  let index: number
  for (index = 0; index < markPos; ++index) {
    array.unshift(stack[index])
  }
  for (index = 0; index <= markPos; ++index) {
    state.pop()
  }
  state.push({
    type: ValueType.array,
    data: array
  })
  array.release()
}

Object.defineProperty(closeArray, 'name', {
  value: ']',
  writable: false
})

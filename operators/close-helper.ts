import { ValueType } from '..'
import { ArrayLike } from '../objects/Array'
import { State } from '../state'
import { findMarkPos } from './operands'

export function closeToMark (state: State, type: ValueType.array | ValueType.proc): void {
  const markPos = findMarkPos(state)
  const mark = state.operandsRef[markPos]
  const operands = state.operandsRef
  const array = new ArrayLike(state.memoryTracker)
  try {
    let index: number
    for (index = 0; index < markPos; ++index) {
      array.unshift(operands[index])
    }
    for (index = 0; index <= markPos; ++index) {
      state.pop()
    }
    state.push({
      ...mark, // propagate debug infos
      type,
      data: array
    })
  } finally {
    array.release()
  }
}

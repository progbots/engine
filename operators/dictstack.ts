import { State } from '../state'
import { ArrayLike } from '../objects/Array'
import { ValueType } from '..'

export function * dictstack (state: State): Generator {
  const array = new ArrayLike(state.memoryTracker)
  const dictionaries = state.dictionariesRef
  try {
    for (const value of dictionaries) {
      array.push(value)
    }
    state.push({
      type: ValueType.array,
      data: array
    })
  } finally {
    array.release()
  }
}

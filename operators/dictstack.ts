import { State } from '../state/index'
import { ArrayLike } from '../objects/Array'
import { ValueType } from '../index'

export function * dictstack (state: State): Generator {
  const array = new ArrayLike(state.memoryTracker)
  const { operands, dictionaries } = state
  try {
    for (const value of dictionaries.ref) {
      array.push(value)
    }
    operands.push({
      type: ValueType.array,
      data: array
    })
  } finally {
    array.release()
  }
}

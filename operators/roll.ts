import { ValueType } from '..'
import { State } from '../state'
import { checkStack } from './check-state'
import { ShareableObject } from '../objects/ShareableObject'
import { StackUnderflow } from '../errors'

export function * roll (state: State): Generator {
  const [steps, size] = checkStack(state, ValueType.integer, ValueType.integer).map(value => value.data as number)
  if (state.stackRef.length < size + 2) {
    throw new StackUnderflow()
  }
  const values = state.stackRef.slice(2, 2 + size).reverse()
  ShareableObject.addRef(values)
  try {
    state.pop()
    state.pop()
    let index
    for (index = 0; index < size; ++index) {
      state.pop()
    }
    for (index = 0; index < size; ++index) {
      state.push(values[(size + index - steps) % size])
    }
  } finally {
    ShareableObject.release(values)
  }
}

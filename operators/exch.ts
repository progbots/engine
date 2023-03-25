import { State } from '../state'
import { checkStack } from './check-state'
import { ShareableObject } from '../objects/ShareableObject'

export function * exch (state: State): Generator {
  const [value1, value2] = checkStack(state, null, null)
  ShareableObject.addRef(value1, value2)
  try {
    state.pop()
    state.pop()
    state.push(value1)
    state.push(value2)
  } finally {
    ShareableObject.release(value1, value2)
  }
}

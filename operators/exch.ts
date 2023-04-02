import { State } from '../state'
import { checkOperands } from './operands'
import { ShareableObject } from '../objects/ShareableObject'

export function * exch (state: State): Generator {
  const [value1, value2] = checkOperands(state, null, null)
  ShareableObject.addRef([value1, value2])
  try {
    state.pop()
    state.pop()
    state.push(value1)
    state.push(value2)
  } finally {
    ShareableObject.release([value1, value2])
  }
}

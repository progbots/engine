import { State } from '../state/index'
import { checkOperands, spliceOperands } from './operands'
import { ShareableObject } from '../objects/ShareableObject'

export function * exch (state: State): Generator {
  const [value1, value2] = checkOperands(state, null, null)
  ShareableObject.addRef([value1, value2])
  try {
    spliceOperands(state, 2, value1, value2)
  } finally {
    ShareableObject.release([value1, value2])
  }
}

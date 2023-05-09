import { State } from '../state/index'
import { ShareableObject } from '../objects/ShareableObject'

export function * exch ({ operands }: State): Generator {
  const [value1, value2] = operands.check(null, null)
  ShareableObject.addRef([value1, value2]) // TODO: does not make sense for strings
  try {
    operands.splice(2, value1, value2)
  } finally {
    ShareableObject.release([value1, value2])
  }
}

import { ValueType } from '../../index'
import { Break } from '../../errors/index'
import { ShareableObject } from '../../objects/ShareableObject'
import { State } from '../../state/index'

export function * loop (state: State): Generator {
  const { operands } = state
  const [block] = operands.check(ValueType.block)
  ShareableObject.addRef(block)
  try {
    operands.pop()
    // Stryker disable next-line all: will obviously lead to a timeout
    while (true) {
      yield * state.evalBlockOrProc(block)
    }
  } catch (e) {
    if (!(e instanceof Break)) {
      throw e
    }
  } finally {
    ShareableObject.release(block)
  }
}

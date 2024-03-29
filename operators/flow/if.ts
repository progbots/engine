import { State } from '../../state/index'
import { ValueType } from '../../index'
import { ShareableObject } from '../../objects/ShareableObject'

export function * ifOp (state: State): Generator {
  const { operands } = state
  const [block, condition] = operands.check(ValueType.block, ValueType.boolean)
  ShareableObject.addRef(block)
  try {
    operands.splice(2)
    if (condition.data as boolean) {
      yield * state.evalBlockOrProc(block)
    }
  } finally {
    ShareableObject.release(block)
  }
}

Object.defineProperty(ifOp, 'name', {
  value: 'if',
  writable: false
})

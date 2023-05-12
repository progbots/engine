import { State } from '../state/index'
import { ValueType } from '../index'
import { ShareableObject } from '../objects/ShareableObject'

export function * ifOp (state: State): Generator {
  const { operands } = state
  const [proc, condition] = operands.check(ValueType.proc, ValueType.boolean)
  ShareableObject.addRef(proc)
  try {
    operands.splice(2)
    if (condition.data as boolean) {
      yield * state.eval(proc)
    }
  } finally {
    ShareableObject.release(proc)
  }
}

Object.defineProperty(ifOp, 'name', {
  value: 'if',
  writable: false
})

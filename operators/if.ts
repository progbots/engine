import { State } from '../state/index'
import { ValueType } from '../index'
import { checkOperands, spliceOperands } from './operands'
import { ShareableObject } from '../objects/ShareableObject'

export function * ifOp (state: State): Generator {
  const [proc, condition] = checkOperands(state, ValueType.proc, ValueType.boolean)
  ShareableObject.addRef(proc)
  try {
    spliceOperands(state, 2)
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

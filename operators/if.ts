import { State } from '../state'
import { ValueType } from '..'
import { checkOperands } from './operands'
import { ShareableObject } from '../objects/ShareableObject'

export function * ifOp (state: State): Generator {
  const [proc, condition] = checkOperands(state, ValueType.proc, ValueType.boolean)
  ShareableObject.addRef(proc)
  try {
    state.pop()
    state.pop()
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

import { State } from '../state'
import { ValueType } from '..'
import { checkOperands } from './operands'
import { ShareableObject } from '../objects/ShareableObject'

export function * ifelse (state: State): Generator {
  const [procElse, procIf, condition] = checkOperands(state, ValueType.proc, ValueType.proc, ValueType.boolean)
  ShareableObject.addRef([procIf, procElse])
  try {
    state.pop()
    state.pop()
    state.pop()
    if (condition.data as boolean) {
      yield * state.eval(procIf)
    } else {
      yield * state.eval(procElse)
    }
  } finally {
    ShareableObject.release([procIf, procElse])
  }
}

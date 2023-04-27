import { State } from '../state/index'
import { ValueType } from '../index'
import { checkOperands, spliceOperands } from './operands'
import { ShareableObject } from '../objects/ShareableObject'

export function * ifelse (state: State): Generator {
  const [procElse, procIf, condition] = checkOperands(state, ValueType.proc, ValueType.proc, ValueType.boolean)
  ShareableObject.addRef([procIf, procElse])
  try {
    spliceOperands(state, 3)
    if (condition.data as boolean) {
      yield * state.eval(procIf)
    } else {
      yield * state.eval(procElse)
    }
  } finally {
    ShareableObject.release([procIf, procElse])
  }
}

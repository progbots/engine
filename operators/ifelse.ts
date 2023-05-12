import { State } from '../state/index'
import { ValueType } from '../index'
import { ShareableObject } from '../objects/ShareableObject'

export function * ifelse (state: State): Generator {
  const { operands } = state
  const [procElse, procIf, condition] = operands.check(ValueType.proc, ValueType.proc, ValueType.boolean)
  ShareableObject.addRef([procIf, procElse])
  try {
    operands.splice(3)
    if (condition.data as boolean) {
      yield * state.eval(procIf)
    } else {
      yield * state.eval(procElse)
    }
  } finally {
    ShareableObject.release([procIf, procElse])
  }
}

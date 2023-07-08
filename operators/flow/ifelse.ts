import { State } from '../../state/index'
import { ValueType } from '../../index'
import { ShareableObject } from '../../objects/ShareableObject'

export function * ifelse (state: State): Generator {
  const { operands } = state
  const [blockElse, blockIf, condition] = operands.check(ValueType.block, ValueType.block, ValueType.boolean)
  ShareableObject.addRef([blockIf, blockElse])
  try {
    operands.splice(3)
    if (condition.data as boolean) {
      yield * state.stackForRunning(blockIf)
    } else {
      yield * state.stackForRunning(blockElse)
    }
  } finally {
    ShareableObject.release([blockIf, blockElse])
  }
}

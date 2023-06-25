import { State } from '../../state/index'
import { ValueType } from '../../index'
import { ShareableObject } from '../../objects/ShareableObject'

export function ifelse (state: State): void {
  const { operands } = state
  const [blockElse, blockIf, condition] = operands.check(ValueType.block, ValueType.block, ValueType.boolean)
  ShareableObject.addRef([blockIf, blockElse])
  try {
    operands.splice(3)
    if (condition.data as boolean) {
      state.queue(blockIf)
    } else {
      state.queue(blockElse)
    }
  } finally {
    ShareableObject.release([blockIf, blockElse])
  }
}

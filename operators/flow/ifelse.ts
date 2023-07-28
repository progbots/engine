import { State, InternalValue } from '../../state/index'
import { ValueType } from '../../index'
import { setOperatorAttributes } from '../attributes'

export function ifelse (state: State, [blockElse, blockIf, condition]: readonly InternalValue[]): void {
  state.operands.splice(3)
  if (condition.data as boolean) {
    state.stackForRunning(blockIf)
  } else {
    state.stackForRunning(blockElse)
  }
}

setOperatorAttributes(ifelse, {
  typeCheck: [ValueType.block, ValueType.block, ValueType.boolean]
})

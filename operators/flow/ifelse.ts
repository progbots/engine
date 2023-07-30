import { State, InternalValue, AtomicResult } from '../../state/index'
import { ValueType } from '../../index'
import { setOperatorAttributes } from '../attributes'

export function ifelse (state: State, [blockElse, blockIf, condition]: readonly InternalValue[]): AtomicResult {
  state.operands.splice(3)
  if (condition.data as boolean) {
    return blockIf
  }
  return blockElse
}

setOperatorAttributes(ifelse, {
  typeCheck: [ValueType.block, ValueType.block, ValueType.boolean]
})

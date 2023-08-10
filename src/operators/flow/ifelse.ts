import { State, InternalValue, CycleResult, checkBlockValue, checkBooleanValue } from '../../state/index'
import { ValueType } from '../../index'
import { setOperatorAttributes } from '../attributes'

/* eslint-disable no-labels */

export function ifelse (state: State, [blockElse, blockIf, condition]: readonly InternalValue[]): CycleResult {
  state.operands.splice(3)
  assert: checkBooleanValue(condition)
  if (condition.data) {
    assert: checkBlockValue(blockIf)
    return blockIf
  }
  assert_2: checkBlockValue(blockElse)
  return blockElse
}

setOperatorAttributes(ifelse, {
  typeCheck: [ValueType.block, ValueType.block, ValueType.boolean]
})

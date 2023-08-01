import { State, InternalValue, CycleResult, checkBlockValue } from '../../state/index'
import { ValueType } from '../../index'
import { setOperatorAttributes } from '../attributes'

/* eslint-disable no-labels */

export function ifelse (state: State, [blockElse, blockIf, condition]: readonly InternalValue[]): CycleResult {
  state.operands.splice(3)
  if (condition.data as boolean) {
    assert: checkBlockValue(blockIf)
    return blockIf
  }
  assert_2: checkBlockValue(blockElse)
  return blockElse
}

setOperatorAttributes(ifelse, {
  typeCheck: [ValueType.block, ValueType.block, ValueType.boolean]
})

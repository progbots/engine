import { CycleResult, InternalValue, State, checkBlockValue, checkBooleanValue } from '../../state/index'
import { ValueType } from '../../index'
import { setOperatorAttributes } from '../attributes'

/* eslint-disable no-labels */

export function ifOp (state: State, [block, condition]: readonly InternalValue[]): CycleResult {
  state.operands.splice(2)
  assert: checkBooleanValue(condition)
  if (condition.data) {
    assert: checkBlockValue(block)
    return block
  }
  return null
}

setOperatorAttributes(ifOp, {
  name: 'if',
  typeCheck: [ValueType.block, ValueType.boolean]
})

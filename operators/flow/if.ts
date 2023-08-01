import { CycleResult, InternalValue, State, checkBlockValue } from '../../state/index'
import { ValueType } from '../../index'
import { setOperatorAttributes } from '../attributes'

/* eslint-disable no-labels */

export function ifOp (state: State, [block, condition]: readonly InternalValue[]): CycleResult {
  state.operands.splice(2)
  if (condition.data as boolean) {
    assert: checkBlockValue(block)
    return block
  }
  return null
}

setOperatorAttributes(ifOp, {
  name: 'if',
  typeCheck: [ValueType.block, ValueType.boolean]
})

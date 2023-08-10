import { CycleResult, InternalValue, State, checkBlockValue } from '../../state/index'
import { ValueType } from '../../index'
import { setOperatorAttributes } from '../attributes'

/* eslint-disable no-labels */

export function finallyOp (state: State, [, block]: readonly InternalValue[]): CycleResult {
  const { operands } = state
  operands.splice(2)
  assert: checkBlockValue(block)
  return block
}

setOperatorAttributes(finallyOp, {
  name: 'finally',
  typeCheck: [ValueType.block, ValueType.block],
  finally (state: State, [blockFinally]: readonly InternalValue[]): CycleResult {
    assert: checkBlockValue(blockFinally)
    return blockFinally
  }
})

import { CycleResult, InternalValue, State } from '../../state/index'
import { ValueType } from '../../index'
import { setOperatorAttributes } from '../attributes'

export function finallyOp (state: State, [, block]: readonly InternalValue[]): CycleResult {
  const { operands } = state
  operands.splice(2)
  return block
}

setOperatorAttributes(finallyOp, {
  name: 'finally',
  typeCheck: [ValueType.block, ValueType.block],
  finally (state: State, [blockFinally]: readonly InternalValue[]): CycleResult {
    return blockFinally
  }
})

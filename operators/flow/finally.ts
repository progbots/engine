import { AtomicResult, InternalValue, State } from '../../state/index'
import { ValueType } from '../../index'
import { setOperatorAttributes } from '../attributes'

export function finallyOp (state: State, [, block]: readonly InternalValue[]): AtomicResult {
  const { operands } = state
  operands.splice(2)
  return block
}

setOperatorAttributes(finallyOp, {
  name: 'finally',
  typeCheck: [ValueType.block, ValueType.block],
  finally (state: State, [blockFinally]: readonly InternalValue[]): AtomicResult {
    return blockFinally
  }
})

import { InternalValue, State } from '../../state/index'
import { ValueType } from '../../index'
import { setOperatorAttributes } from '../attributes'

export function finallyOp (state: State, [, block]: readonly InternalValue[]): void {
  const { operands } = state
  operands.splice(2)
  state.stackForRunning(block)
}

setOperatorAttributes(finallyOp, {
  name: 'finally',
  typeCheck: [ValueType.block, ValueType.block],
  finally (state: State, [blockFinally]: readonly InternalValue[]): void {
    state.stackForRunning(blockFinally)
  }
})

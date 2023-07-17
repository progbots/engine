import { InternalValue, State } from '../../state/index'
import { ValueType } from '../../index'
import { setOperatorAttributes } from '../attributes'

export function * finallyOp (state: State, [, block]: InternalValue[]): Generator {
  const { operands } = state
  operands.splice(2)
  return state.stackForRunning(block)
}

setOperatorAttributes(finallyOp, {
  name: 'finally',
  typeCheck: [ValueType.block, ValueType.block],
  finally (state: State, [blockFinally]: InternalValue[]): Generator {
    return state.stackForRunning(blockFinally)
  }
})

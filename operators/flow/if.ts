import { InternalValue, State } from '../../state/index'
import { ValueType } from '../../index'
import { setOperatorAttributes } from '../attributes'

export function ifOp (state: State, [block, condition]: InternalValue[]): void {
  state.operands.splice(2)
  if (condition.data as boolean) {
    state.stackForRunning(block)
  }
}

setOperatorAttributes(ifOp, {
  name: 'if',
  typeCheck: [ValueType.block, ValueType.boolean]
})

import { AtomicResult, InternalValue, State } from '../../state/index'
import { ValueType } from '../../index'
import { setOperatorAttributes } from '../attributes'

export function ifOp (state: State, [block, condition]: readonly InternalValue[]): AtomicResult {
  state.operands.splice(2)
  if (condition.data as boolean) {
    return block
  }
  return null
}

setOperatorAttributes(ifOp, {
  name: 'if',
  typeCheck: [ValueType.block, ValueType.boolean]
})

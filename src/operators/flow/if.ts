import { BlockValue, BooleanValue, ValueType } from '@api'
import { CycleResult, Internal, IInternalState } from '@sdk'
import { setOperatorAttributes } from '@operators/attributes'

export function ifOp (state: IInternalState, block: Internal<BlockValue>, condition: Internal<BooleanValue>): CycleResult {
  state.operands.splice(2)
  if (condition.isSet) {
    return block
  }
  return null
}

setOperatorAttributes(ifOp, {
  name: 'if'
}, ValueType.block, ValueType.boolean)

import { BlockValue, BooleanValue, ValueType } from '@api'
import { CycleResult, Internal, IInternalState } from '@sdk'
import { setOperatorAttributes } from '@operators/attributes'

export function ifelse (state: IInternalState, blockElse: Internal<BlockValue>, blockIf: Internal<BlockValue>, condition: Internal<BooleanValue>): CycleResult {
  if (condition.isSet) {
    return blockIf
  }
  return blockElse
}

setOperatorAttributes(ifelse,
  {},
  ValueType.block, ValueType.block, ValueType.boolean
)

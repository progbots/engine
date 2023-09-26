import { BlockValue, ValueType, checkBlockValue } from '@api'
import { CycleResult, InternalValue, IInternalState, Internal } from '@sdk'
import { setOperatorAttributes } from '@operators/attributes'

export function finallyOp ({ operands }: IInternalState, handler: Internal<BlockValue>, block: Internal<BlockValue>): CycleResult {
  operands.splice(2)
  return block
}

setOperatorAttributes(finallyOp, {
  name: 'finally',
  finally (state: IInternalState, parameters: readonly InternalValue[]): CycleResult {
    const handler = parameters[0]
    checkBlockValue(handler)
    return handler
  }
}, ValueType.block, ValueType.block)

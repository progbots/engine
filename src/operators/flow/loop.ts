import { BlockValue, ValueType, checkBlockValue } from '@api'
import { IInternalState, InternalValue, CycleResult, Internal, IError } from '@sdk'
import { Break } from '@errors'
import { setOperatorAttributes } from '@operators/attributes'

export function loop ({ operands }: IInternalState, block: Internal<BlockValue>): CycleResult {
  operands.pop()
  return null
}

setOperatorAttributes(loop, {
  loop (state: IInternalState, parameters: readonly InternalValue[], index: number): CycleResult | false {
    const block = parameters[0]
    checkBlockValue(block)
    return block
  },
  catch (state: IInternalState, parameters: readonly InternalValue[], e: IError): CycleResult {
    if (!(e instanceof Break)) {
      throw e
    }
    return null
  }
}, ValueType.block)

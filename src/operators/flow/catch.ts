import { BlockValue, ValueType, checkBlockValue } from '@api'
import { CycleResult, InternalValue, IInternalState, Internal, IError } from '@sdk'
import { setOperatorAttributes } from '@operators/attributes'

export function catchOp (state: IInternalState, handler: Internal<BlockValue>, block: Internal<BlockValue>): CycleResult {
  state.operands.splice(2)
  return block
}

setOperatorAttributes(catchOp, {
  name: 'catch',
  catch (state: IInternalState, parameters: readonly InternalValue[], e: IError): CycleResult {
    state.operands.push({
      type: ValueType.dictionary,
      dictionary: e.dictionary
    })
    e.release()
    const handler = parameters[0]
    checkBlockValue(handler)
    return handler
  }
}, ValueType.block, ValueType.block)

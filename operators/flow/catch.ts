import { AtomicResult, InternalValue, State } from '../../state/index'
import { ValueType } from '../../index'
import { InternalError } from '../../errors/InternalError'
import { setOperatorAttributes } from '../attributes'

export function catchOp (state: State, [, block]: readonly InternalValue[]): AtomicResult {
  state.operands.splice(2)
  return block
}

setOperatorAttributes(catchOp, {
  name: 'catch',
  typeCheck: [ValueType.block, ValueType.block],
  catch (state: State, [blockCatch]: readonly InternalValue[], e: InternalError): AtomicResult {
    state.operands.push({
      type: ValueType.dict,
      data: e.dictionary
    })
    e.release()
    return blockCatch
  }
})

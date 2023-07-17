import { InternalValue, State } from '../../state/index'
import { ValueType } from '../../index'
import { InternalError } from '../../errors/InternalError'
import { setOperatorAttributes } from '../attributes'

export function * catchOp (state: State, [, block]: InternalValue[]): Generator {
  state.operands.splice(2)
  return state.stackForRunning(block)
}

setOperatorAttributes(catchOp, {
  name: 'catch',
  typeCheck: [ValueType.block, ValueType.block],
  catch (state: State, [blockCatch]: InternalValue[], e: InternalError): Generator {
    state.operands.push({
      type: ValueType.dict,
      data: e.dictionary
    })
    e.release()
    return state.stackForRunning(blockCatch)
  }
})

import { InternalValue, State } from '../../state/index'
import { ValueType } from '../../index'
import { InternalError } from '../../errors/InternalError'
import { setOperatorAttributes } from '../attributes'

export function catchOp (state: State, [, block]: readonly InternalValue[]): void {
  state.operands.splice(2)
  state.stackForRunning(block)
}

setOperatorAttributes(catchOp, {
  name: 'catch',
  typeCheck: [ValueType.block, ValueType.block],
  catch (state: State, [blockCatch]: readonly InternalValue[], e: InternalError): void {
    state.operands.push({
      type: ValueType.dict,
      data: e.dictionary
    })
    e.release()
    state.stackForRunning(blockCatch)
  }
})

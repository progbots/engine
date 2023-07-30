import { ValueType } from '../../index'
import { Break } from '../../errors/index'
import { State, InternalValue, AtomicResult } from '../../state/index'
import { InternalError } from '../../errors/InternalError'
import { setOperatorAttributes } from '../attributes'

export function loop (state: State, [block]: readonly InternalValue[]): AtomicResult {
  state.operands.pop()
  return null
}

setOperatorAttributes(loop, {
  typeCheck: [ValueType.block],
  loop (state: State, [block]: readonly InternalValue[]): AtomicResult | false {
    return block
  },
  catch (state: State, parameters: readonly InternalValue[], e: InternalError): AtomicResult {
    if (!(e instanceof Break)) {
      throw e
    }
    return null
  }
})

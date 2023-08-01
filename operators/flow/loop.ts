import { ValueType } from '../../index'
import { Break } from '../../errors/index'
import { State, InternalValue, CycleResult, checkBlockValue } from '../../state/index'
import { InternalError } from '../../errors/InternalError'
import { setOperatorAttributes } from '../attributes'

/* eslint-disable no-labels */

export function loop (state: State, [block]: readonly InternalValue[]): CycleResult {
  state.operands.pop()
  return null
}

setOperatorAttributes(loop, {
  typeCheck: [ValueType.block],
  loop (state: State, [block]: readonly InternalValue[]): CycleResult | false {
    assert: checkBlockValue(block)
    return block
  },
  catch (state: State, parameters: readonly InternalValue[], e: InternalError): CycleResult {
    if (!(e instanceof Break)) {
      throw e
    }
    return null
  }
})

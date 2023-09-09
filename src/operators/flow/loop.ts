import { ValueType } from '../../index'
import { Break } from '../../src/errors/index'
import { State, InternalValue, CycleResult, checkBlockValue } from '../../state/index'
import { BaseError } from '../../src/errors/BaseError'
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
  catch (state: State, parameters: readonly InternalValue[], e: BaseError): CycleResult {
    if (!(e instanceof Break)) {
      throw e
    }
    return null
  }
})

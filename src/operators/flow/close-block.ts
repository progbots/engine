import { ValueType } from '@api'
import { CycleResult, IInternalState } from '@sdk'
import { closeToMark } from '../open-close-helper'
import { setOperatorAttributes } from '@operators/attributes'

export function closeBlock (state: IInternalState): CycleResult {
  closeToMark(state, ValueType.block)
  state.allowCall()
  return null
}

setOperatorAttributes(closeBlock, {
  name: '}'
})

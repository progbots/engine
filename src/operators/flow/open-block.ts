import { CycleResult, IInternalState } from '@sdk'
import { openWithMark } from '../open-close-helper'
import { setOperatorAttributes } from '@operators/attributes'

export function openBlock (state: IInternalState): CycleResult {
  openWithMark(state)
  state.preventCall()
  return null
}

setOperatorAttributes(openBlock, {
  name: '{'
})

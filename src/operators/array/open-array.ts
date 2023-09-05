import { CycleResult, IInternalState } from '@sdk'
import { openWithMark } from '../open-close-helper'
import { setOperatorAttributes } from '@operators/attributes'

export function openArray (state: IInternalState): CycleResult {
  openWithMark(state)
  return null
}

setOperatorAttributes(openArray, {
  name: '['
})

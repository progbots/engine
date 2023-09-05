import { ValueType } from '@api'
import { CycleResult, IInternalState } from '@sdk'
import { closeToMark } from '../open-close-helper'
import { setOperatorAttributes } from '../attributes'

export function closeArray (state: IInternalState): CycleResult {
  closeToMark(state, ValueType.array)
  return null
}

setOperatorAttributes(closeArray, {
  name: ']'
})

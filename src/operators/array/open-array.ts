import { CycleResult, State } from '../../state/index'
import { openWithMark } from '../open-close-helper'
import { setOperatorAttributes } from '../attributes'

export function openArray (state: State): CycleResult {
  openWithMark(state)
  return null
}

setOperatorAttributes(openArray, {
  name: '['
})

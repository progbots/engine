import { AtomicResult, State } from '../../state/index'
import { ValueType } from '../../index'
import { closeToMark } from '../open-close-helper'
import { setOperatorAttributes } from '../attributes'

export function closeArray (state: State): AtomicResult {
  closeToMark(state, ValueType.array)
  return null
}

setOperatorAttributes(closeArray, {
  name: ']'
})

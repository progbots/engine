import { State } from '../../state/index'
import { ValueType } from '../../index'
import { closeToMark } from '../open-close-helper'
import { setOperatorAttributes } from '../attributes'

export function closeArray (state: State): void {
  closeToMark(state, ValueType.array)
}

setOperatorAttributes(closeArray, {
  name: ']'
})

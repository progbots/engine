import { State } from '../../state/index'
import { openWithMark } from '../open-close-helper'
import { setOperatorAttributes } from '../attributes'

export function openArray (state: State): void {
  openWithMark(state)
}

setOperatorAttributes(openArray, {
  name: '['
})

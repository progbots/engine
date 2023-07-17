import { State } from '../../state/index'
import { openWithMark } from '../open-close-helper'
import { setOperatorAttributes } from '../attributes'

export function openArray (state: State): undefined {
  openWithMark(state)
}

setOperatorAttributes(openArray, {
  name: '['
})

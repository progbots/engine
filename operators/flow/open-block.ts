import { State } from '../../state/index'
import { openWithMark } from '../open-close-helper'

export function openBlock (state: State): undefined {
  openWithMark(state)
  state.preventCall()
}

Object.defineProperty(openBlock, 'name', {
  value: '{',
  writable: false
})

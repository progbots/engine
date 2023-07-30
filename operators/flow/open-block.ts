import { AtomicResult, State } from '../../state/index'
import { openWithMark } from '../open-close-helper'

export function openBlock (state: State): AtomicResult {
  openWithMark(state)
  state.preventCall()
  return null
}

Object.defineProperty(openBlock, 'name', {
  value: '{',
  writable: false
})

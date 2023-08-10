import { CycleResult, State } from '../../state/index'
import { openWithMark } from '../open-close-helper'

export function openBlock (state: State): CycleResult {
  openWithMark(state)
  state.preventCall()
  return null
}

Object.defineProperty(openBlock, 'name', {
  value: '{',
  writable: false
})

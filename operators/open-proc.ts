import { State } from '../state'
import { openWithMark } from './open-close-helper'

export function * openProc (state: State): Generator {
  openWithMark(state)
  state.preventCall()
}

Object.defineProperty(openProc, 'name', {
  value: '{',
  writable: false
})

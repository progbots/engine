import { State } from '../../state/index'
import { openWithMark } from '../open-close-helper'

export function * openBlock (state: State): Generator {
  openWithMark(state)
  state.preventCall()
}

Object.defineProperty(openBlock, 'name', {
  value: '{',
  writable: false
})

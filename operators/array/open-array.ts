import { State } from '../../state/index'
import { openWithMark } from '../open-close-helper'

export function openArray (state: State): undefined {
  openWithMark(state)
}

Object.defineProperty(openArray, 'name', {
  value: '[',
  writable: false
})

import { State } from '../../state/index'
import { ValueType } from '../../index'
import { closeToMark } from '../open-close-helper'

export function closeArray (state: State): undefined {
  closeToMark(state, ValueType.array)
}

Object.defineProperty(closeArray, 'name', {
  value: ']',
  writable: false
})

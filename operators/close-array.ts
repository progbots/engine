import { State } from '../state'
import { ValueType } from '..'
import { closeToMark } from './close-helper'

export function * closeArray (state: State): Generator {
  closeToMark(state, ValueType.array)
}

Object.defineProperty(closeArray, 'name', {
  value: ']',
  writable: false
})

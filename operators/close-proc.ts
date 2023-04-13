import { State } from '../state/index'
import { ValueType } from '../index'
import { closeToMark } from './open-close-helper'

export function * closeProc (state: State): Generator {
  closeToMark(state, ValueType.proc)
  state.allowCall()
}

Object.defineProperty(closeProc, 'name', {
  value: '}',
  writable: false
})

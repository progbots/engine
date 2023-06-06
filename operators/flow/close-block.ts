import { State } from '../../state/index'
import { ValueType } from '../../index'
import { closeToMark } from '../open-close-helper'

export function * closeBlock (state: State): Generator {
  closeToMark(state, ValueType.block)
  state.allowCall()
}

Object.defineProperty(closeBlock, 'name', {
  value: '}',
  writable: false
})

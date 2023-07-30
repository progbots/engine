import { AtomicResult, State } from '../../state/index'
import { ValueType } from '../../index'
import { closeToMark } from '../open-close-helper'

export function closeBlock (state: State): AtomicResult {
  closeToMark(state, ValueType.block)
  state.allowCall()
  return null
}

Object.defineProperty(closeBlock, 'name', {
  value: '}',
  writable: false
})

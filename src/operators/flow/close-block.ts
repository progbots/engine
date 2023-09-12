import { ValueType } from '@api'
import { CycleResult, IInternalState } from '@sdk'
import { closeToMark } from '../open-close-helper'

export function closeBlock (state: IInternalState): CycleResult {
  closeToMark(state, ValueType.block)
  state.allowCall()
  return null
}

Object.defineProperty(closeBlock, 'name', {
  value: '}',
  writable: false
})

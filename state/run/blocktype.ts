import { RunStepResult } from './types'
import { IArray, EngineSignalType } from '../../index'
import { State } from '../index'

function init (this: State): RunStepResult {
  const { top } = this.calls
  this.calls.step = blocktype.indexOf(loop)
  this.calls.index = 0
  return {
    type: EngineSignalType.beforeBlock,
    debug: true,
    block: top as unknown as IArray
  }
}

function loop (this: State): RunStepResult {
  const { top } = this.calls
  const array = top as unknown as IArray
  const { length } = array
  const { index } = this.calls
  if (index < length) {
    this.calls.step = blocktype.indexOf(stack)
    return {
      type: EngineSignalType.beforeBlockItem,
      debug: true,
      block: array,
      index
    }
  } else {
    this.calls.step = -1
    return {
      type: EngineSignalType.afterBlock,
      debug: true,
      block: array
    }
  }
}

function stack (this: State): RunStepResult {
  const { top } = this.calls
  const array = top as unknown as IArray
  const { index } = this.calls
  this.calls.index = index + 1
  this.calls.step = blocktype.indexOf(loop)
  return array.at(index)
}

export const blocktype = [
  init,
  loop,
  stack
]

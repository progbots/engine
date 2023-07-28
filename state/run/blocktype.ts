import { RUN_STEP_END, RunStepResult } from './types'
import { IArray, EngineSignalType } from '../../index'
import { State } from '../index'

function init (this: State): RunStepResult {
  const { top } = this.calls
  this.calls.step = blocktype.indexOf(loop)
  this.calls.index = 0
  return {
    type: EngineSignalType.beforeBlock,
    debug: true,
    block: top.data as IArray
  }
}

function loop (this: State): RunStepResult {
  const { top } = this.calls
  const array = top.data as IArray
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
    this.calls.step = RUN_STEP_END
    return {
      type: EngineSignalType.afterBlock,
      debug: true,
      block: array
    }
  }
}

function stack (this: State): RunStepResult {
  const { top } = this.calls
  const array = top.data as IArray
  const { index } = this.calls
  ++this.calls.index
  this.calls.step = blocktype.indexOf(loop)
  return array.at(index)
}

export const blocktype = [
  init,
  loop,
  stack
]

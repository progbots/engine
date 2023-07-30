import { RUN_STEP_END } from './types'
import { IArray, EngineSignalType } from '../../index'
import { InternalValue, AtomicResult, State } from '../index'

function init (this: State, { data }: InternalValue): AtomicResult {
  this.calls.step = blocktype.indexOf(loop)
  this.calls.index = 0
  return {
    type: EngineSignalType.beforeBlock,
    debug: true,
    block: data as IArray
  }
}

function loop (this: State, { data }: InternalValue, index: number): AtomicResult {
  const array = data as IArray
  const { length } = array
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

function stack (this: State, { data }: InternalValue, index: number): AtomicResult {
  const array = data as IArray
  ++this.calls.index
  this.calls.step = blocktype.indexOf(loop)
  return array.at(index)
}

export const blocktype = [
  init,
  loop,
  stack
]

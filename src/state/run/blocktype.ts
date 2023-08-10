import { RUN_STEP_END } from './types'
import { EngineSignalType, ValueType } from '../../index'
import { InternalValue, CycleResult, State, checkIArray } from '../index'

/* eslint-disable no-labels */

function init (this: State, { data }: InternalValue): CycleResult {
  assert: checkIArray(data)
  this.calls.step = blocktype.indexOf(loop)
  this.calls.index = 0
  return {
    type: EngineSignalType.beforeBlock,
    debug: true,
    block: data
  }
}

function loop (this: State, { data }: InternalValue, index: number): CycleResult {
  assert: checkIArray(data)
  const { length } = data
  if (index < length) {
    this.calls.step = blocktype.indexOf(stack)
    return {
      type: EngineSignalType.beforeBlockItem,
      debug: true,
      block: data,
      index
    }
  } else {
    this.calls.step = RUN_STEP_END
    return {
      type: EngineSignalType.afterBlock,
      debug: true,
      block: data
    }
  }
}

function stack (this: State, { data }: InternalValue, index: number): CycleResult {
  assert: checkIArray(data)
  ++this.calls.index
  this.calls.step = blocktype.indexOf(loop)
  const value = data.at(index)
  const { type } = value
  if ([ValueType.call, ValueType.operator].includes(type)) {
    return value
  }
  this.operands.push(value)
  return null
}

export const blocktype = [
  init,
  loop,
  stack
]

import { BlockValue, SignalType, ValueType } from '@api'
import { CycleResult, IInternalState } from '@sdk'
import { RUN_STEP_END, RunSteps } from './RunSteps'
import { InternalError } from '@errors'

function init (this: IInternalState, { block }: BlockValue): CycleResult {
  this.calls.step = blocktype.indexOf(loop)
  this.calls.index = 0
  return {
    type: SignalType.beforeBlock,
    debug: true,
    block
  }
}

function loop (this: IInternalState, { block }: BlockValue, index: number): CycleResult {
  const { length } = block
  if (index < length) {
    this.calls.step = blocktype.indexOf(stack)
    return {
      type: SignalType.beforeBlockItem,
      debug: true,
      block,
      index
    }
  } else {
    this.calls.step = RUN_STEP_END
    return {
      type: SignalType.afterBlock,
      debug: true,
      block
    }
  }
}

function stack (this: IInternalState, { block }: BlockValue, index: number): CycleResult {
  ++this.calls.index
  this.calls.step = blocktype.indexOf(loop)
  const value = block.at(index)
  if (value === null) {
    throw new InternalError('Unexpected null')
  }
  const { type } = value
  if ([ValueType.call, ValueType.operator].includes(type)) {
    return value
  }
  this.operands.push(value)
  return null
}

export const blocktype: RunSteps<ValueType.block> = [
  init,
  loop,
  stack
]

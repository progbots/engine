import { CallValue, SignalType, ValueType } from '@api'
import { CycleResult, IInternalState } from '@sdk'
import { RUN_STEP_END, RunSteps } from './RunSteps'

function init (this: IInternalState, { call }: CallValue): CycleResult {
  this.calls.step = calltype.indexOf(lookup)
  return {
    type: SignalType.beforeCall,
    debug: true,
    name: call
  }
}

function lookup (this: IInternalState, { call }: CallValue): CycleResult {
  const value = this.dictionaries.lookup(call)
  this.calls.step = calltype.indexOf(after)
  if ([ValueType.block, ValueType.call, ValueType.operator].includes(value.type)) {
    return value
  }
  this.operands.push(value)
  return null
}

function after (this: IInternalState, { call }: CallValue): CycleResult {
  this.calls.step = RUN_STEP_END
  return {
    type: SignalType.afterCall,
    debug: true,
    name: call
  }
}

export const calltype: RunSteps<ValueType.call> = [
  init,
  lookup,
  after
]

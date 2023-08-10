import { RUN_STEP_END } from './types'
import { EngineSignalType } from '../../index'
import { InternalValue, CycleResult, State } from '../index'

function init (this: State, { data }: InternalValue): CycleResult {
  this.calls.step = calltype.indexOf(lookup)
  return {
    type: EngineSignalType.beforeCall,
    debug: true,
    name: data as string
  }
}

function lookup (this: State, { data }: InternalValue): CycleResult {
  const resolvedValue = this.dictionaries.lookup(data as string)
  this.calls.step = calltype.indexOf(after)
  // TODO decide if operand / execute
  return resolvedValue
}

function after (this: State, { data }: InternalValue): CycleResult {
  this.calls.step = RUN_STEP_END
  return {
    type: EngineSignalType.afterCall,
    debug: true,
    name: data as string
  }
}

export const calltype = [
  init,
  lookup,
  after
]

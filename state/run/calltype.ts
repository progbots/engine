import { RUN_STEP_END, RunStepResult } from './types'
import { EngineSignalType } from '../../index'
import { InternalValue, State } from '../index'

function init (this: State, { data }: InternalValue): RunStepResult {
  this.calls.step = calltype.indexOf(lookup)
  return {
    type: EngineSignalType.beforeCall,
    debug: true,
    name: data as string
  }
}

function lookup (this: State, { data }: InternalValue): RunStepResult {
  const resolvedValue = this.dictionaries.lookup(data as string)
  this.calls.step = calltype.indexOf(after)
  return resolvedValue
}

function after (this: State, { data }: InternalValue): RunStepResult {
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
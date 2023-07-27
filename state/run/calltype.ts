import { RunStepResult } from './types'
import { EngineSignalType } from '../../index'
import { State } from '../index'

function init (this: State): RunStepResult {
  const { top } = this.calls
  this.calls.step = calltype.indexOf(lookup)
  return {
    type: EngineSignalType.beforeCall,
    debug: true,
    name: top.data as string
  }
}

function lookup (this: State): RunStepResult {
  const { top } = this.calls
  const resolvedValue = this.dictionaries.lookup(top.data as string)
  this.calls.step = calltype.indexOf(after)
  return resolvedValue
}

function after (this: State): RunStepResult {
  const { top } = this.calls
  this.calls.step = -1
  return {
    type: EngineSignalType.afterCall,
    debug: true,
    name: top.data as string
  }
}

export const calltype = [
  init,
  lookup,
  after
]

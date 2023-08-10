import { RUN_STEP_END, RUN_STEP_CATCH, RUN_STEP_FINALLY } from './types'
import { EngineSignalType } from '../../index'
import { CycleResult, InternalValue, State, checkOperatorFunction } from '../index'

/* eslint-disable no-labels */

function init (this: State, { data }: InternalValue): CycleResult {
  assert: checkOperatorFunction(data)
  this.calls.step = operatortype.indexOf(execute)
  return {
    type: EngineSignalType.beforeOperator,
    debug: true,
    name: data.name
  }
}

function execute (this: State, { data }: InternalValue): CycleResult {
  assert: checkOperatorFunction(data)
  if (data.constant !== undefined) {
    this.calls.step = operatortype.indexOf(after)
    return data.constant
  }
  if (data.typeCheck !== undefined) {
    this.calls.parameters = this.operands.check(...data.typeCheck)
  }
  if (data.loop !== undefined) {
    this.calls.index = 0
    this.calls.step = operatortype.indexOf(loop)
  } else {
    this.calls.step = operatortype.indexOf(after)
  }
  return data(this, this.calls.parameters)
}

function loop (this: State, { data }: InternalValue, index: number): CycleResult {
  assert: checkOperatorFunction(data)
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  if (data.loop!(this, this.calls.parameters, index) === false) {
    this.calls.step = operatortype.indexOf(after)
  } else {
    ++this.calls.index
  }
  return null
}

function after (this: State): CycleResult {
  const { top } = this.calls
  assert: checkOperatorFunction(top.data)
  this.calls.step = RUN_STEP_END
  return {
    type: EngineSignalType.afterOperator,
    debug: true,
    name: top.data.name
  }
}

export const operatortype = [
  init,
  execute,
  loop,
  after
]

operatortype[RUN_STEP_CATCH] = function (this: State, { data }: InternalValue): CycleResult {
  assert: checkOperatorFunction(data)
  this.calls.step = RUN_STEP_END
  if (data.catch !== undefined) {
    return data.catch(this, this.calls.parameters, this.error)
  }
  return null
}

operatortype[RUN_STEP_FINALLY] = function (this: State, { data }: InternalValue): CycleResult {
  assert: checkOperatorFunction(data)
  this.calls.step = RUN_STEP_END
  if (data.finally !== undefined) {
    return data.finally(this, this.calls.parameters)
  }
  return null
}

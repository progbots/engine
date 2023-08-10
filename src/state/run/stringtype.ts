import { RUN_STEP_END } from './types'
import { EngineSignalType, ValueType } from '../../index'
import { InternalValue, CycleResult, State, checkStringValue, checkIntegerValue, checkInternalValue } from '../index'
import { parse } from '../parser'

/* eslint-disable no-labels */

function init (this: State, value: InternalValue): CycleResult {
  const { sourceFile } = value
  assert: checkStringValue(value)
  this.calls.step = stringtype.indexOf(start)
  return {
    type: EngineSignalType.beforeParse,
    debug: true,
    source: value.data,
    sourceFile
  }
}

function start (this: State, top: InternalValue): CycleResult {
  this.calls.index = 0
  this.calls.parameters = []
  return extract.call(this, top, 0)
}

function next (this: State, value: InternalValue): CycleResult {
  const [, nextPos] = this.calls.parameters
  assert: checkIntegerValue(nextPos)
  this.calls.popParameter()
  this.calls.popParameter()
  this.calls.index = nextPos.data
  return extract.call(this, value, this.calls.index)
}

function extract (this: State, value: InternalValue, pos: number): CycleResult {
  const { sourceFile } = value
  assert: checkStringValue(value)
  const parsedValue = parse(value.data, pos)
  if (parsedValue === undefined) {
    this.calls.step = RUN_STEP_END
    return {
      type: EngineSignalType.afterParse,
      debug: true,
      source: value.data,
      sourceFile
    }
  }
  const { nextPos, sourcePos, ...rawValue } = parsedValue
  assert: checkInternalValue(rawValue)
  if (this.flags.keepDebugInfo) {
    rawValue.sourceFile = sourceFile
    rawValue.sourcePos = sourcePos
  } else {
    delete rawValue.source
  }
  this.calls.step = stringtype.indexOf(stack)
  this.calls.pushParameter(rawValue)
  this.calls.pushParameter({
    type: ValueType.integer,
    data: nextPos
  })
  return {
    type: EngineSignalType.tokenParsed,
    debug: true,
    source: value.data,
    sourceFile,
    sourcePos: parsedValue.sourcePos,
    token: parsedValue.data.toString()
  }
}

function stack (this: State): CycleResult {
  const value = this.calls.parameters[0]
  this.calls.step = stringtype.indexOf(next)
  // TODO distinguish executable type from operand ones
  return value
}

export const stringtype = [
  init,
  start,
  next,
  stack
]

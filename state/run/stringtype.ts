import { RunStepResult } from './types'
import { EngineSignalType, ValueType } from '../../index'
import { InternalValue, State } from '../index'
import { parse } from '../parser'

function init (this: State): RunStepResult {
  const { sourceFile, data } = this.calls.top
  const source = data as string
  this.calls.step = stringtype.indexOf(start)
  return {
    type: EngineSignalType.beforeParse,
    debug: true,
    source,
    sourceFile
  }
}

function start (this: State): RunStepResult {
  this.calls.index = 0
  this.calls.parameters = []
  return extract.call(this)
}

function next (this: State): RunStepResult {
  const [, nextPos] = this.calls.parameters
  this.calls.popParameter()
  this.calls.popParameter()
  this.calls.index = nextPos.data as number
  return extract.call(this)
}

function extract (this: State): RunStepResult {
  const { sourceFile, data } = this.calls.top
  const source = data as string
  const sourcePos = this.calls.index
  const parsedValue = parse(source, sourcePos)
  if (parsedValue === undefined) {
    this.calls.step = -1
    return {
      type: EngineSignalType.afterParse,
      debug: true,
      source,
      sourceFile
    }
  }
  const { nextPos, ...rawValue } = parsedValue
  const value: InternalValue = { ...rawValue }
  if (this.flags.keepDebugInfo) {
    value.sourceFile = sourceFile
  } else {
    delete value.source
    delete value.sourcePos
  }
  this.calls.step = stringtype.indexOf(stack)
  this.calls.pushParameter(value)
  this.calls.pushParameter({
    type: ValueType.integer,
    data: nextPos
  })
  return {
    type: EngineSignalType.tokenParsed,
    debug: true,
    source,
    sourceFile,
    sourcePos: parsedValue.sourcePos,
    token: parsedValue.data.toString()
  }
}

function stack (this: State): RunStepResult {
  const value = this.calls.parameters[0]
  this.calls.step = stringtype.indexOf(next)
  return value
}

export const stringtype = [
  init,
  start,
  next,
  stack
]

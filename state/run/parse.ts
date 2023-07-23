import { RunHandlerReturn } from './types'
import { EngineSignal, EngineSignalType } from '../../index'
import { InternalValue, State } from '../index'

function init (this: State): RunHandlerReturn {
  const { sourceFile, data } = this.calls.top
  const source = data as string
  const beforeParse: EngineSignal = {
    type: EngineSignalType.beforeParse,
    debug: true,
    source,
    sourceFile
  }
  this.calls.step = parse.indexOf(start)
  return beforeParse
}

function start (this: State): RunHandlerReturn {
  this.calls.index = 0
  this.calls.parameters = []
  return extract.call(this)
}

function next (this: State): RunHandlerReturn {
  const value = this.calls.parameters[0]
  this.calls.popParameter()
  // this.calls.index += ?
  return extract.call(this)
}

function extract (this: State): RunHandlerReturn {
  const { sourceFile, data } = this.calls.top
  const source = data as string
  const sourcePos = this.calls.index
  const parsedValue = parseAt(source, sourceFile, sourcePos)
  if (parsedValue === undefined) {
    const afterParse: EngineSignal = {
      type: EngineSignalType.afterParse,
      debug: true,
      source,
      sourceFile
    }
    this.calls.step = -1
    return afterParse
  }
  const value: InternalValue = { ...parsedValue }
  if (!this.flags.keepDebugInfo) {
    delete value.source
    delete value.sourcePos
    delete value.sourceFile
  }
  const tokenParsed: EngineSignal = {
    type: EngineSignalType.tokenParsed,
    debug: true,
    source,
    sourceFile,
    sourcePos: parsedValue.sourcePos,
    token: parsedValue.data.toString()
  }
  this.calls.step = parse.indexOf(submit)
  this.calls.pushParameter(value)
  return tokenParsed
}

function submit (this: State): RunHandlerReturn {
  const value = this.calls.parameters[0]
  this.calls.step = parse.indexOf(next)
  return value
}

export const parse = [
  init,
  start,
  next,
  submit
]

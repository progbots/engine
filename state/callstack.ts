import { IArray, Value, ValueType } from '../index'
import { InternalValue, checkIArray, checkStringValue } from './index'
import { formatters } from '../formatters'
import { parse } from './parser'
import { Internal } from '../errors/index'

/* eslint-disable no-labels */

const BEFORE_CURRENT = '»'
const AFTER_CURRENT = '«'
const UNEXPECTED_PARSER_FAILURE = 'Unexpected parser failure'

const unexpected = (value: Value): string => `/!\\ unexpected stack item type ${value.type}`

function stringify (text: string): string {
  return JSON.stringify(text
    .replace(/\r?\n/g, '↵')
    .replace(/\t/g, '⭲')
  )
}

function codeRenderer (value: Value, callIndex: number | undefined): string {
  const output = ['{']
  assert: checkIArray(value.data)
  const { length } = value.data
  for (let index = 0; index < length; ++index) {
    const item = value.data.at(index)
    if (callIndex === index) {
      output.push(BEFORE_CURRENT + formatters[item.type](item) + AFTER_CURRENT)
    } else {
      output.push(formatters[item.type](item))
    }
  }
  output.push('}')
  return output.join(' ')
}

const renderers: Record<ValueType, (value: Value, callIndex: number | undefined) => string> = {
  [ValueType.boolean]: unexpected,
  [ValueType.integer]: unexpected,
  [ValueType.string]: (value: Value, callIndex: number | undefined): string => {
    assert: checkStringValue(value)
    // const text = value.data
    if (callIndex !== undefined) {
      const before = value.data.substring(0, callIndex)
      const parsedValue = parse(value.data, callIndex)
      if (parsedValue === undefined) {
        throw new Internal(UNEXPECTED_PARSER_FAILURE)
      }
      const keyword = formatters[parsedValue.type](parsedValue)
      const after = value.data.substring(parsedValue.nextPos)
      return stringify(`${before}${BEFORE_CURRENT}${keyword}${AFTER_CURRENT}${after}`)
    }
    return stringify(value.data)
  },
  [ValueType.call]: (value: Value): string => formatters[value.type](value),
  [ValueType.operator]: (value: Value, callIndex: number | undefined): string => {
    const base = formatters[value.type](value)
    if (callIndex !== undefined) {
      return `${base}:${callIndex}`
    }
    return base
  },
  [ValueType.mark]: unexpected,
  [ValueType.array]: unexpected,
  [ValueType.dict]: unexpected,
  [ValueType.block]: codeRenderer,
  [ValueType.proc]: codeRenderer
}

export function renderCallStack (calls: IArray): string {
  const { length } = calls
  const callstack: string[] = []
  let callIndex: number | undefined
  for (let index = 0; index < length; ++index) {
    const value = calls.at(index) as InternalValue
    if (value.type === ValueType.integer) {
      callIndex = value.data
      continue
    }
    let debugInfo = ''
    const { sourceFile, sourcePos } = value
    if (sourceFile !== undefined && sourcePos !== undefined) {
      debugInfo = ` @${sourceFile}:${sourcePos.toString()}`
    }
    const rendered = renderers[value.type](value, callIndex)
    callstack.push(rendered + debugInfo)
    callIndex = undefined
  }
  return callstack.join('\n')
}

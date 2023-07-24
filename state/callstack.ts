import { IArray, Value, ValueType } from '../index'
import { InternalValue } from './index'
import { formatters } from '../formatters'
import { parse } from './parser'
import { Internal } from '../errors/index'

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
  const array: IArray = value.data as IArray
  const { length } = array
  for (let index = 0; index < length; ++index) {
    const item = array.at(index)
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
    const text = value.data as string
    if (callIndex !== undefined) {
      const before = text.substring(0, callIndex)
      const value = parse(text, callIndex)
      if (value === undefined) {
        throw new Internal(UNEXPECTED_PARSER_FAILURE)
      }
      const keyword = formatters[value.type](value)
      const after = text.substring(value.nextPos)
      return stringify(`${before}${BEFORE_CURRENT}${keyword}${AFTER_CURRENT}${after}`)
    }
    return stringify(text)
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

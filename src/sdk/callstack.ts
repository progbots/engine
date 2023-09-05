import { IArray, Value, ValueType, checkBlockValue, checkStringValue, getIArrayValues } from '@api'
import { formatters, getDebugInfos } from '@sdk'
import { Internal } from '@errors'
import { parse } from '@state/parser'

const BEFORE_CURRENT = '»'
const AFTER_CURRENT = '«'
const UNEXPECTED_PARSER_FAILURE = 'Unexpected parser failure'

const unexpected = <T>(value: Value<T>): string => `/!\\ unexpected stack item type ${value.type}`

function stringify (text: string): string {
  return JSON.stringify(text
    .replace(/\r?\n/g, '↵')
    .replace(/\t/g, '⭲')
  )
}

const format = (value: Value): string => formatters[value.type](value)

const renderers: Record<ValueType, (value: Value, callIndex: number | undefined) => string> = {
  [ValueType.boolean]: unexpected,
  [ValueType.integer]: unexpected,
  [ValueType.string]: (value: Value, callIndex: number | undefined): string => {
    checkStringValue(value)
    const { string } = value
    if (callIndex !== undefined) {
      const before = string.substring(0, callIndex)
      const parsedValue = parse(string, '', callIndex)
      if (parsedValue === undefined || parsedValue.debug === undefined) {
        throw new Internal(UNEXPECTED_PARSER_FAILURE)
      }
      const keyword = formatters[parsedValue.type](parsedValue)
      const after = string.substring(parsedValue.debug.pos + parsedValue.debug.length)
      return stringify(`${before}${BEFORE_CURRENT}${keyword}${AFTER_CURRENT}${after}`)
    }
    return stringify(string)
  },
  [ValueType.call]: format,
  [ValueType.operator]: (value: Value, callIndex: number | undefined): string => {
    const base = format(value)
    if (callIndex !== undefined) {
      return `${base}:${callIndex}`
    }
    return base
  },
  [ValueType.mark]: unexpected,
  [ValueType.array]: unexpected,
  [ValueType.dictionary]: unexpected,
  [ValueType.block]: (value: Value, callIndex: number | undefined): string => {
    checkBlockValue(value)
    const { block } = value
    const output = ['{']
    let index = 0
    for (const item of getIArrayValues(block)) {
      const formattedItem = format(item)
      if (index === callIndex) {
        output.push(BEFORE_CURRENT + formattedItem + AFTER_CURRENT)
      } else {
        output.push(formattedItem)
      }
      ++index
    }
    output.push('}')
    return output.join(' ')
  }
}

export function renderCallStack (calls: IArray): string {
  const callstack: string[] = []
  let callIndex: number | undefined
  for (const value of getIArrayValues(calls)) {
    const { type } = value
    if (type === ValueType.integer) {
      callIndex = value.number
      continue
    }
    let debugInfo = ''
    const debug = getDebugInfos(value)
    if (debug !== undefined) {
      if (type === ValueType.string) {
        debugInfo = ` @${debug.filename}`
      } else {
        debugInfo = ` @${debug.filename}:${debug.pos.toString()}`
      }
    }
    const rendered = renderers[value.type](value, callIndex)
    callstack.push(rendered + debugInfo)
    callIndex = undefined
  }
  return callstack.join('\n')
}

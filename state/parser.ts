import { ValueType } from '../index'
import { InternalValue } from './index'

export type ParsedValue = InternalValue & {
  data: string | number
  sourcePos: number
  nextPos: number
}

export function parse (source: string, pos: number): ParsedValue | undefined {
  const matcher = /%[^\n]*|(?:"([^"]*)")|\s|((?:-|\+)?\d+)|(\[|\]|{|}|[^[\]{}}\s]+)/g
  matcher.lastIndex = pos
  let match = matcher.exec(source)
  while (match !== null) {
    const [, string, integer, call] = match
    const baseValue: ParsedValue = {
      type: ValueType.integer,
      data: 0,
      source,
      sourcePos: match.index,
      nextPos: match.index + match[0].length
    }
    if (string !== undefined) {
      return {
        ...baseValue,
        type: ValueType.string,
        data: string
      }
    } else if (integer !== undefined) {
      return {
        ...baseValue,
        type: ValueType.integer,
        data: parseInt(integer, 10)
      }
    } else if (call !== undefined) {
      return {
        ...baseValue,
        type: ValueType.call,
        data: call
      }
    }
    match = matcher.exec(source)
  }
}

import { ValueType } from '../index'
import { InternalValue } from './index'

export type ParsedValue = InternalValue & {
  sourcePos: number
  nextPos: number
}

export function parse (source: string, pos: number): ParsedValue | undefined {
  const matcher = /%[^\n]*|(?:"([^"]*)")|\s|((?:-|\+)?\d+)|(\[|\]|{|}|[^[\]{}}\s]+)/g
  matcher.lastIndex = pos
  let match = matcher.exec(source)
  while (match !== null) {
    const [, string, integer, call] = match
    const baseValue = {
      source,
      sourcePos: match.index,
      nextPos: match.index + match[0].length
    }
    if (string !== undefined) {
      return {
        ...baseValue,
        type: ValueType.string,
        string
      }
    } else if (integer !== undefined) {
      return {
        ...baseValue,
        type: ValueType.integer,
        number: parseInt(integer, 10)
      }
    } else if (call !== undefined) {
      return {
        ...baseValue,
        type: ValueType.call,
        call
      }
    }
    match = matcher.exec(source)
  }
}

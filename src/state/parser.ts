import { ValueType } from '@api'
import { DebugInfos, InternalValue } from '@sdk'

export function parse (source: string, filename: string, pos: number): InternalValue | undefined {
  const matcher = /%[^\n]*|(?:"([^"]*)")|\s|((?:-|\+)?\d+)|(\[|\]|{|}|[^[\]{}}\s]+)/g
  matcher.lastIndex = pos
  let match = matcher.exec(source)
  while (match !== null) {
    const [text, string, integer, call] = match
    const debug: DebugInfos = {
      source,
      filename,
      pos: match.index,
      length: text.length
    }
    if (string !== undefined) {
      return {
        debug,
        type: ValueType.string,
        string
      }
    } else if (integer !== undefined) {
      return {
        debug,
        type: ValueType.integer,
        number: parseInt(integer, 10)
      }
    } else if (call !== undefined) {
      return {
        debug,
        type: ValueType.call,
        call
      }
    }
    match = matcher.exec(source)
  }
  return undefined
}

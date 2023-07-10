import { ValueType } from '../index'
import { InternalValue } from './index'

type ParsedValue = InternalValue & {
  data: string | number
  sourceFile: string
  sourcePos: number
}

let lastParseId = -1

export function * parse (source: string, sourceFile: string = `parsed${++lastParseId}`): Generator<ParsedValue, void> {
  const matcher = /%[^\n]*|(?:"([^"]*)")|\s|((?:-|\+)?\d+)|(\[|\]|{|}|[^[\]{}}\s]+)/g
  let match = matcher.exec(source)
  // Stryker disable next-line BlockStatement
  while (match !== null) {
    const [, string, integer, call] = match
    const debugValue: ParsedValue = {
      type: ValueType.integer,
      data: 0,
      source,
      sourceFile,
      sourcePos: match.index
    }
    if (string !== undefined) {
      yield {
        ...debugValue,
        type: ValueType.string,
        data: string
      }
    } else if (integer !== undefined) {
      yield {
        ...debugValue,
        type: ValueType.integer,
        data: parseInt(integer, 10)
      }
    } else if (call !== undefined) {
      yield {
        ...debugValue,
        type: ValueType.call,
        data: call
      }
    }
    match = matcher.exec(source)
  }
}

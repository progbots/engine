import { ValueType } from '../index'
import { InternalValue } from './index'

export function * parse (source: string, sourceFile?: string): Generator<InternalValue, void> {
  const matcher = /%[^\n]*|(?:"([^"]*)")|\s|((?:-|\+)?\d+)|(\[|\]|{|}|[^[\]{}}\s]+)/g
  let match = matcher.exec(source)
  // Stryker disable next-line BlockStatement
  while (match !== null) {
    const [, string, integer, call] = match
    const debugValue: InternalValue = {
      type: ValueType.integer,
      data: 0,
      source,
      sourcePos: match.index
    }
    if (sourceFile !== undefined) {
      debugValue.sourceFile = sourceFile
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

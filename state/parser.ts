import { ValueType } from '..'
import { InternalValue } from '.'

export function * parse (source: string, sourceFile?: string): Generator<InternalValue> {
  const matcher = /%[^\n]*|(?:"([^"]*)")|\s+|((?:-|\+)?\d+)|\/(\S+)|(\[|\]|{|}|\S+)/g
  let match = matcher.exec(source)
  while (match !== null) {
    const [, string, integer, name, call] = match
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
    } else if (name !== undefined) {
      yield {
        ...debugValue,
        type: ValueType.name,
        data: name
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

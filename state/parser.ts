import { ValueType } from '..'
import { ValueEx } from '.'

export function * parse (source: string, sourceFile?: string): Generator<ValueEx> {
  const matcher = /%[^\n]*|(?:"([^"]*)")|\s+|((?:-|\+)?\d+)|\/(\S+)|(\[|\]|{|}|\S+)/g
  let match = matcher.exec(source)
  while (match !== null) {
    const [, string, integer, name, call] = match
    const debugInfos = {
      source,
      sourceFile,
      sourcePos: match.index
    }
    if (string !== undefined) {
      yield {
        type: ValueType.string,
        data: string,
        ...debugInfos
      }
    } else if (integer !== undefined) {
      yield {
        type: ValueType.integer,
        data: parseInt(integer, 10),
        ...debugInfos
      }
    } else if (name !== undefined) {
      yield {
        type: ValueType.name,
        data: name,
        ...debugInfos
      }
    } else if (call !== undefined) {
      yield {
        type: ValueType.call,
        data: call,
        ...debugInfos
      }
    }
    match = matcher.exec(source)
  }
}

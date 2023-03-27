import { Value, ValueType } from '..'

// TODO: the output should contain position in source (for debugging purpose)

export function * parse (source: string): Generator<Value> {
  const matcher = /%[^\n]*|(?:"([^"]*)")|\s+|((?:-|\+)?\d+)|\/(\S+)|(\[|\]|{|}|\S+)/g
  let match = matcher.exec(source)
  while (match !== null) {
    const [, string, integer, name, call] = match
    if (string !== undefined) {
      yield {
        type: ValueType.string,
        data: string
      }
    } else if (integer !== undefined) {
      yield {
        type: ValueType.integer,
        data: parseInt(integer, 10)
      }
    } else if (name !== undefined) {
      yield {
        type: ValueType.name,
        data: name
      }
    } else if (call !== undefined) {
      yield {
        type: ValueType.call,
        data: call
      }
    }
    match = matcher.exec(source)
  }
}

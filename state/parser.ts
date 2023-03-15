import { IState, Value, ValueType } from '../types'

export function * parse (src: string, state: IState): Generator<Value> {
  const matcher = /(?:"([^"]*)")|(-?\d+)|(\w+)/g
  let match = matcher.exec(src)
  while (match !== null) {
    const [, string, integer, name] = match
    if (integer !== undefined) {
      yield {
        type: ValueType.integer,
        data: parseInt(integer, 10)
      }
    } else if (name !== undefined) {
      yield {
        type: ValueType.name,
        data: name
      }
    } else if (string !== undefined) {
      yield {
        type: ValueType.string,
        data: string
      }
    }
    match = matcher.exec(src)
  }
}

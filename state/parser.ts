import { IState, Value, ValueType } from '../types'

export function * parse (src: string, state: IState): Generator<Value> {
  const matcher = /(?:"([^"]*)")|(-?\d+)|\/(\w+)|(\w+|\[|\])/g
  let match = matcher.exec(src)
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
    match = matcher.exec(src)
  }
}

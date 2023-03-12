import { IState, Value, ValueType } from './types'

export function * parse (src: string, state: IState): Generator<Value> {
  const matcher = /(\d+)|(\w+)/g
  let match = matcher.exec(src)
  while (match !== null) {
    const [, digits, name] = match
    if (digits !== undefined) {
      yield {
        type: ValueType.integer,
        data: parseInt(digits, 10)
      }
    } else if (name !== undefined) {
      yield {
        type: ValueType.name,
        data: name
      }
    }
    match = matcher.exec(src)
  }
}

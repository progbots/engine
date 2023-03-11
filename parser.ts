import { IState, Value, ValueType } from './types'

export function parse (src: string, state: IState): Value[] {
  const values: Value[] = []

  // Very basic implementation
  src.replace(/(\d+)|(\w+)/g, (_: string, digits: string | undefined, id: string | undefined): string => {
    if (digits !== undefined) {
      values.push({
        type: ValueType.integer,
        data: parseInt(digits, 10)
      })
    } else if (id !== undefined) {
      values.push({
        type: ValueType.name,
        data: id
      })
    }
    return _
  })

  return values
}

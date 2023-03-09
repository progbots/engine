import { IState, Value, ValueType } from './types'

export function parse (src: string, state: IState): Value {
  const block: Value[] = []

  // Very basic implementation
  src.replace(/(\d+)|(\w+)/g, (_: string, digits: string | undefined, id: string | undefined): string => {
    if (digits !== undefined) {
      block.push({
        type: ValueType.number,
        data: parseInt(digits, 10)
      })
    } else if (id !== undefined) {
      block.push({
        type: ValueType.id,
        data: id
      })
    }
    return _
  })

  if (block.length === 1) {
    return block[0]
  }
  return {
    type: ValueType.block,
    data: block
  }
}

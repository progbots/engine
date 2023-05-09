import { ValueType } from '../index'
import { ArrayLike } from '../objects/Array'
import { State } from '../state/index'

export function openWithMark ({ operands }: State): void {
  const openInstruction = operands.at(0)
  operands.push({
    ...openInstruction, // propagate debug infos
    type: ValueType.mark,
    data: null
  })
}

export function closeToMark (state: State, type: ValueType.array | ValueType.proc): void {
  const { operands } = state
  const markPos = operands.findMarkPos()
  const mark = operands.at(markPos)
  const array = new ArrayLike(state.memoryTracker)
  try {
    let index: number
    for (index = 0; index < markPos; ++index) {
      array.unshift(operands.at(index))
    }
    operands.splice(markPos + 1, {
      ...mark, // propagate debug infos
      type,
      data: array
    })
  } finally {
    array.release()
  }
}

import { ValueType } from '../index'
import { ArrayLike } from '../objects/Array'
import { State } from '../state/index'

export function openWithMark ({ operands, calls }: State): void {
  const openInstruction = calls.ref[1]
  operands.push({
    ...openInstruction, // propagate debug infos
    type: ValueType.mark,
    data: null
  })
}

export function closeToMark (state: State, type: ValueType.array | ValueType.block): void {
  const { operands } = state
  const markPos = operands.findMarkPos()
  const mark = operands.ref[markPos]
  const array = new ArrayLike(state.memoryTracker)
  try {
    let index: number
    for (index = 0; index < markPos; ++index) {
      array.unshift(operands.ref[index])
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

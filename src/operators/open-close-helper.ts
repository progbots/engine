import { ValueType } from '@api'
import { IInternalState } from '@sdk'
import { ValueArray } from '@objects/ValueArray'
import { extractDebugInfos } from './debug-infos'

export function openWithMark ({ operands, calls }: IInternalState): void {
  const openInstruction = calls.ref[1]
  operands.push({
    ...extractDebugInfos(openInstruction),
    type: ValueType.mark,
    data: null
  })
}

export function closeToMark (state: IInternalState, type: ValueType.array | ValueType.block): void {
  const { operands } = state
  const markPos = operands.findMarkPos()
  const mark = operands.ref[markPos]
  const array = new ValueArray(state.memoryTracker)
  try {
    let index: number
    for (index = 0; index < markPos; ++index) {
      array.unshift(operands.ref[index])
    }
    operands.splice(markPos + 1, {
      ...extractDebugInfos(mark),
      type,
      data: array
    })
  } finally {
    array.release()
  }
}

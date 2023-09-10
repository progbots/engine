import { ValueType } from '@api'
import { CycleResult, IInternalState } from '@sdk'
import { ValueArray } from '@objects/ValueArray'

export function dictstack ({ dictionaries, memoryTracker, operands }: IInternalState): CycleResult {
  const array = new ValueArray(memoryTracker)
  try {
    for (const value of dictionaries.ref) {
      array.push(value)
    }
    operands.push({
      type: ValueType.array,
      array
    })
  } finally {
    array.release()
  }
  return null
}

import { ValueType, checkStringValue } from '@api'
import { InternalValue, CycleResult, IInternalState } from '@sdk'
import { TypeCheck } from '@errors'
import { Dictionary } from '@dictionaries'

export function dicttomark ({ memoryTracker, operands }: IInternalState): CycleResult {
  const pos = operands.findMarkPos()
  if (pos % 2 !== 0) {
    throw new TypeCheck()
  }
  const mappings = operands.ref.slice(0, pos)
  let index = 0
  let value: InternalValue = { type: ValueType.mark }
  const dictionary = new Dictionary(memoryTracker)
  try {
    for (const item of mappings) {
      if (index % 2 === 1) {
        checkStringValue(item)
        dictionary.def(item.string, value)
      } else {
        value = item
      }
      ++index
    }
    operands.splice(pos + 1, {
      type: ValueType.dictionary,
      dictionary
    })
  } catch (e) {
    throw new TypeCheck()
  } finally {
    dictionary.release()
  }
  return null
}

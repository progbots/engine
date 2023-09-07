import { ValueType, checkStringValue } from '@api'
import { InternalValue, CycleResult, IInternalState } from '@sdk'
import { TypeCheck } from '@errors'
import { Dictionary } from '@dictionaries'

export function dicttomark ({ memoryTracker, operands }: IInternalState): CycleResult {
  const pos = operands.findMarkPos()
  if (pos % 2 !== 0) {
    throw new TypeCheck()
  }
  const names = operands.ref.slice(0, pos).filter((_, index) => index % 2 === 1)
  if (names.some(value => value.type !== ValueType.string)) {
    throw new TypeCheck()
  }
  const dictionary = new Dictionary(memoryTracker)
  try {
    names.forEach((name: InternalValue, index: number) => {
      let value = operands.ref[2 * index]
      checkStringValue(name)
      dictionary.def(name.string, value)
    })
    operands.splice(pos + 1, {
      type: ValueType.dictionary,
      dictionary
    })
  } finally {
    dictionary.release()
  }
  return null
}

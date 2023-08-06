import { TypeCheck } from '../../errors/index'
import { ValueType } from '../../index'
import { InternalValue, CycleResult, State, checkStringValue } from '../../state/index'
import { Dictionary } from '../../objects/dictionaries/index'

/* eslint-disable no-labels */

export function dicttomark (state: State): CycleResult {
  const { operands } = state
  const pos = operands.findMarkPos()
  if (pos % 2 !== 0) {
    throw new TypeCheck()
  }
  const names = operands.ref.slice(0, pos).filter((_, index) => index % 2 === 1)
  if (names.some(value => value.type !== ValueType.string)) {
    throw new TypeCheck()
  }
  const dict = new Dictionary(state.memoryTracker)
  try {
    names.forEach((name: InternalValue, index: number) => {
      let value: InternalValue = operands.ref[2 * index]
      if (value.type === ValueType.block) {
        value = {
          ...value,
          type: ValueType.proc
        }
      }
      assert: checkStringValue(name)
      dict.def(name.data, value)
    })
    operands.splice(pos + 1, {
      type: ValueType.dict,
      data: dict
    })
  } finally {
    dict.release()
  }
  return null
}

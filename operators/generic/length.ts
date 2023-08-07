import { ValueType } from '../../index'
import { TypeCheck } from '../../errors/index'
import { CycleResult, InternalValue, State, checkDictValue, checkStringValue } from '../../state/index'
import { ArrayLike } from '../../objects/Array'

/* eslint-disable no-labels */

function arrayLikeLength (container: InternalValue): number {
  assert: ArrayLike.check(container.data)
  return container.data.length
}

const sizers: Record<string, (container: InternalValue) => number> = {
  [ValueType.string]: (container: InternalValue): number => {
    assert: checkStringValue(container)
    return container.data.length
  },

  [ValueType.array]: arrayLikeLength,

  [ValueType.dict]: (container: InternalValue): number => {
    assert: checkDictValue(container)
    return container.data.names.length
  },

  [ValueType.block]: arrayLikeLength,

  [ValueType.proc]: arrayLikeLength
}

export function length ({ operands }: State): CycleResult {
  const [container] = operands.check(null)
  const sizer = sizers[container.type]
  if (sizer === undefined) {
    throw new TypeCheck()
  }
  operands.splice(1, {
    type: ValueType.integer,
    data: sizer(container)
  })
  return null
}

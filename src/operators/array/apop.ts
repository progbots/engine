import { CycleResult, State } from '../../state/index'
import { ValueType } from '../../index'
import { ArrayLike } from '../../objects/Array'
import { ShareableObject } from '../../objects/ShareableObject'
import { RangeCheck } from '../../src/errors/index'

/* eslint-disable no-labels */

export function apop ({ operands }: State): CycleResult {
  const [{ data }] = operands.check(ValueType.array)
  assert: ArrayLike.check(data)
  const value = data.ref.at(-1)
  if (value === undefined) {
    throw new RangeCheck()
  }
  ShareableObject.addRef(value) // TODO should be released *after* slice
  data.pop()
  operands.splice(1, value)
  return null
}

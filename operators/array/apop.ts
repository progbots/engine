import { CycleResult, State } from '../../state/index'
import { ValueType } from '../../index'
import { ArrayLike } from '../../objects/Array'
import { ShareableObject } from '../../objects/ShareableObject'
import { RangeCheck } from '../../errors/index'

export function apop ({ operands }: State): CycleResult {
  const [{ data }] = operands.check(ValueType.array)
  const array = data as unknown as ArrayLike
  const value = array.ref.at(-1)
  if (value === undefined) {
    throw new RangeCheck()
  }
  ShareableObject.addRef(value) // TODO should be released *after* slice
  array.pop()
  operands.splice(1, value)
  return null
}

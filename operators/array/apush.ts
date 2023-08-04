import { CycleResult, State } from '../../state/index'
import { ValueType } from '../../index'
import { ArrayLike } from '../../objects/Array'

/* eslint-disable no-labels */

export function apush ({ operands }: State): CycleResult {
  const [value, { data }] = operands.check(null, ValueType.array)
  assert: ArrayLike.check(data)
  data.push(value)
  operands.splice(2)
  return null
}

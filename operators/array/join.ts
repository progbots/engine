import { ValueType } from '../../index'
import { TypeCheck } from '../../errors/index'
import { CycleResult, State } from '../../state/index'
import { ArrayLike } from '../../objects/Array'

/* eslint-disable no-labels */

export function join (state: State): CycleResult {
  const { operands } = state
  const [{ data }] = operands.check(ValueType.array)
  assert: ArrayLike.check(data)
  if (data.some(value => value.type !== ValueType.string)) {
    throw new TypeCheck()
  }
  const strings = data.ref.map(value => value.data as string)
  operands.splice(1, {
    type: ValueType.string,
    data: strings.join('')
  })
  return null
}

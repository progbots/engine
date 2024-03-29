import { State } from '../../state/index'
import { ValueType } from '../../index'
import { ArrayLike } from '../../objects/Array'

export function * apush ({ operands }: State): Generator {
  const [value, { data }] = operands.check(null, ValueType.array)
  const array = data as unknown as ArrayLike
  array.push(value)
  operands.splice(2)
}

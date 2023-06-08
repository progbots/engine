import { State } from '../../state/index'
import { ValueType } from '../../index'
import { ArrayLike } from '../../objects/Array'

export function * apop ({ operands }: State): Generator {
  const [{ data }] = operands.check(ValueType.array)
  const array = data as unknown as ArrayLike
  array.pop()
  operands.splice(1)
}

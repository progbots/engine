import { State } from '../state/index'
import { ValueType } from '../index'
import { checkOperands, spliceOperands } from './operands'
import { ArrayLike } from '../objects/Array'

export function * apush (state: State): Generator {
  const [value, { data }] = checkOperands(state, null, ValueType.array)
  const array = data as unknown as ArrayLike
  array.push(value)
  spliceOperands(state, 2)
}

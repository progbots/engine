import { ValueType } from '../index'
import { State } from '../state/index'
import { checkOperands, spliceOperands } from './operands'

export function * eq (state: State): Generator {
  const [value1, value2] = checkOperands(state, null, null)
  spliceOperands(state, 2, {
    type: ValueType.boolean,
    data: value1.type === value2.type && value1.data === value2.data
  })
}

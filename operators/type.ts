import { ValueType } from '../index'
import { State } from '../state/index'
import { checkOperands, spliceOperands } from './operands'

export function * type (state: State): Generator {
  const [{ type }] = checkOperands(state, null)
  spliceOperands(state, 1, {
    type: ValueType.string,
    data: type
  })
}

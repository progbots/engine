import { State } from '../state/index'
import { ValueType } from '../index'
import { checkOperands } from './operands'

export function * sub (state: State): Generator {
  const [num1, num2] = checkOperands(state, ValueType.integer, ValueType.integer).map(value => value.data as number)
  state.pop()
  state.pop()
  state.push({
    type: ValueType.integer,
    data: num2 - num1
  })
}

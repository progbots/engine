import { ValueType } from '../index'
import { State } from '../state/index'
import { checkOperands } from './operands'

export function compare (state: State, implementation: (value1: number, value2: number) => boolean): void {
  const [value2, value1] = checkOperands(state, ValueType.integer, ValueType.integer).map(value => value.data as number)
  const result = implementation(value1, value2)
  state.pop()
  state.pop()
  state.push({
    type: ValueType.boolean,
    data: result
  })
}

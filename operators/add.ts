import { State } from '../state'
import { ValueType } from '../types'
import { checkStack } from './check-state'

export function add (state: State): void {
  const [num1, num2] = checkStack(state, ValueType.integer, ValueType.integer).map(value => value.data as number)
  state.pop()
  state.pop()
  state.push({
    type: ValueType.integer,
    data: num1 + num2
  })
}

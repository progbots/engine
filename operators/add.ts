import { State } from '../state'
import { ValueType } from '..'
import { checkStack } from './check-state'

export function * add (state: State): Generator {
  const [num1, num2] = checkStack(state, ValueType.integer, ValueType.integer).map(value => value.data as number)
  state.pop()
  state.pop()
  state.push({
    type: ValueType.integer,
    data: num1 + num2
  })
}

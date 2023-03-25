import { ValueType } from '..'
import { State } from '../state'
import { checkStack } from './check-state'

export function * eq (state: State): Generator {
  const [value1, value2] = checkStack(state, null, null)
  const result = value1.type === value2.type && value1.data === value2.data
  state.pop()
  state.pop()
  state.push({
    type: ValueType.boolean,
    data: result
  })
}

import { ValueType } from '..'
import { State } from '../state'
import { checkStack } from './check-state'

export function * type (state: State): Generator {
  checkStack(state, null)
  const [{ type }] = state.stackRef
  state.pop()
  state.push({
    type: ValueType.string,
    data: type
  })
}

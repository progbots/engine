import { ValueType } from '..'
import { State } from '../state'
import { checkStack } from './check-state'

export function * type (state: State): Generator {
  checkStack(state, null)
  const [value] = state.stackRef
  state.push({
    type: ValueType.string,
    data: value.type as string
  })
}

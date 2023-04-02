import { ValueType } from '..'
import { State } from '../state'
import { checkOperands } from './operands'

export function * type (state: State): Generator {
  const [{ type }] = checkOperands(state, null)
  state.pop()
  state.push({
    type: ValueType.string,
    data: type
  })
}

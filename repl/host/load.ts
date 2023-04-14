import { ValueType } from '../../index'
import { checkOperands } from '../../operators/operands'
import { State } from '../../state/index'
import { getReplHost } from '../replHost'

export function * load (state: State): Generator {
  const [name] = checkOperands(state, ValueType.string).map(value => value.data as string)
  state.pop()
  const source = getReplHost().getSample(name)
  yield * state.innerParse(source, name)
}

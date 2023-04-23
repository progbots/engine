import { ValueType } from '../../index'
import { checkOperands } from '../../operators/operands'
import { State } from '../../state/index'
import { $load } from '../signals'

export function * load (state: State): Generator {
  const [name] = checkOperands(state, ValueType.string).map(value => value.data as string)
  const sourceOrError = yield $load
  if (typeof sourceOrError === 'string') {
    state.pop()
    yield * state.innerParse(sourceOrError, name)
  } else {
    throw sourceOrError
  }
}

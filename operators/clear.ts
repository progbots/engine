import { State } from '../state/index'
import { spliceOperands } from './operands'

export function * clear (state: State): Generator {
  const { length } = state.operandsRef
  spliceOperands(state, length)
}

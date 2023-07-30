import { AtomicResult, State } from '../../state/index'
import { compute } from './integer'

export function sub (state: State): AtomicResult {
  compute(state, (value1: number, value2: number) => value1 - value2)
  return null
}

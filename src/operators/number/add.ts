import { CycleResult, State } from '../../state/index'
import { compute } from './integer'

export function add (state: State): CycleResult {
  compute(state, (value1: number, value2: number) => value1 + value2)
  return null
}
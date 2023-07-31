import { CycleResult, State } from '../../state/index'
import { compare } from './integer'

export function lt (state: State): CycleResult {
  compare(state, (value1: number, value2: number) => value1 < value2)
  return null
}

import { CycleResult, IInternalState } from '@sdk'
import { compute } from './integer'

export function add (state: IInternalState): CycleResult {
  compute(state, (value1: number, value2: number) => value1 + value2)
  return null
}

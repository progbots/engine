import { CycleResult, IInternalState } from '@sdk'
import { compare } from './integer'

export function lt (state: IInternalState): CycleResult {
  compare(state, (value1: number, value2: number) => value1 < value2)
  return null
}

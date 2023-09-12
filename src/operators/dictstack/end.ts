import { CycleResult, IInternalState } from '@sdk'

export function end ({ dictionaries }: IInternalState): CycleResult {
  dictionaries.end()
  return null
}

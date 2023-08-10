import { CycleResult, State } from '../../state/index'

export function end ({ dictionaries }: State): CycleResult {
  dictionaries.end()
  return null
}

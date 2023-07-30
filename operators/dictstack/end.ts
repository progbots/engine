import { AtomicResult, State } from '../../state/index'

export function end ({ dictionaries }: State): AtomicResult {
  dictionaries.end()
  return null
}

import { AtomicResult, State } from '../../state/index'

export function pop ({ operands }: State): AtomicResult {
  operands.pop()
  return null
}

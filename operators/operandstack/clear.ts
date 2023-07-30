import { AtomicResult, State } from '../../state/index'

export function clear ({ operands }: State): AtomicResult {
  operands.splice(operands.length)
  return null
}

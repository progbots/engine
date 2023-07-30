import { AtomicResult, State } from '../../state/index'

export function dup ({ operands }: State): AtomicResult {
  const [value] = operands.check(null)
  operands.push(value)
  return null
}

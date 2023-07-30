import { AtomicResult, State } from '../../state/index'

export function exch ({ operands }: State): AtomicResult {
  const values = operands.check(null, null)
  operands.splice(2, values)
  return null
}

import { CycleResult, State } from '../../state/index'

export function exch ({ operands }: State): CycleResult {
  const values = operands.check(null, null)
  operands.splice(2, values)
  return null
}

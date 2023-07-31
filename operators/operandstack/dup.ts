import { CycleResult, State } from '../../state/index'

export function dup ({ operands }: State): CycleResult {
  const [value] = operands.check(null)
  operands.push(value)
  return null
}

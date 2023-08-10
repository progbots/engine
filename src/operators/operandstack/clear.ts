import { CycleResult, State } from '../../state/index'

export function clear ({ operands }: State): CycleResult {
  operands.splice(operands.length)
  return null
}

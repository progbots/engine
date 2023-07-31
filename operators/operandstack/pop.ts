import { CycleResult, State } from '../../state/index'

export function pop ({ operands }: State): CycleResult {
  operands.pop()
  return null
}

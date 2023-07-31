import { CycleResult, State } from '../../state/index'

export function cleartomark ({ operands }: State): CycleResult {
  operands.splice(operands.findMarkPos() + 1)
  return null
}

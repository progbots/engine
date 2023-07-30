import { AtomicResult, State } from '../../state/index'

export function cleartomark ({ operands }: State): AtomicResult {
  operands.splice(operands.findMarkPos() + 1)
  return null
}

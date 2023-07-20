import { State } from '../../state/index'

export function cleartomark ({ operands }: State): void {
  operands.splice(operands.findMarkPos() + 1)
}

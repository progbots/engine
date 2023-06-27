import { State } from '../../state/index'

export function cleartomark ({ operands }: State): undefined {
  operands.splice(operands.findMarkPos() + 1)
}

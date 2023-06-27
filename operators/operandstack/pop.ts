import { State } from '../../state/index'

export function pop ({ operands }: State): undefined {
  operands.pop()
}

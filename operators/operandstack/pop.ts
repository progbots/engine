import { State } from '../../state/index'

export function pop ({ operands }: State): void {
  operands.pop()
}

import { State } from '../../state/index'

export function clear ({ operands }: State): void {
  operands.splice(operands.length)
}

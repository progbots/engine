import { State } from '../../state/index'

export function clear ({ operands }: State): undefined {
  operands.splice(operands.length)
}

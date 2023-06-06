import { State } from '../../state/index'

export function * clear ({ operands }: State): Generator {
  operands.splice(operands.length)
}

import { State } from '../state/index'

export function * pop ({ operands }: State): Generator {
  operands.pop()
}

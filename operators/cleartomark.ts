import { State } from '../state/index'

export function * cleartomark ({ operands }: State): Generator {
  operands.splice(operands.findMarkPos() + 1)
}

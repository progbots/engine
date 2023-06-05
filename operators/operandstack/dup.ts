import { State } from '../../state/index'

export function * dup ({ operands }: State): Generator {
  const [value] = operands.check(null)
  operands.push(value)
}

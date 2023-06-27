import { State } from '../../state/index'

export function dup ({ operands }: State): undefined {
  const [value] = operands.check(null)
  operands.push(value)
}

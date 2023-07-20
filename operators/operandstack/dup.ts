import { State } from '../../state/index'

export function dup ({ operands }: State): void {
  const [value] = operands.check(null)
  operands.push(value)
}

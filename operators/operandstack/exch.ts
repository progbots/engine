import { State } from '../../state/index'

export function exch ({ operands }: State): undefined {
  const values = operands.check(null, null)
  operands.splice(2, values)
}

import { ValueType } from '../../index'
import { State } from '../../state/index'

export function print (state: State): undefined {
  const [string] = state.operands.check(ValueType.string).map(value => value.data as string)
  console.log(string)
  state.operands.splice(1)
}

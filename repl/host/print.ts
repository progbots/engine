import { ValueType } from '../../index'
import { State, checkStringValue } from '../../state/index'

/* eslint-disable no-labels */

export function print (state: State): undefined {
  const [string] = state.operands.check(ValueType.string).map(value => {
    assert: checkStringValue(value)
    return value.data
  })
  console.log(string)
  state.operands.splice(1)
}

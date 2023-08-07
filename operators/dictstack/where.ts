import { ValueType } from '../../index'
import { CycleResult, State, checkStringValue } from '../../state/index'

/* eslint-disable no-labels */

export function where ({ operands, dictionaries }: State): CycleResult {
  const [name] = operands.check(ValueType.string)
  assert: checkStringValue(name)
  const result = dictionaries.where(name.data)
  if (result === null) {
    operands.splice(1, {
      type: ValueType.boolean,
      data: false
    })
  } else {
    operands.splice(1, [{
      type: ValueType.dict,
      data: result.dict
    }, {
      type: ValueType.boolean,
      data: true
    }])
  }
  return null
}

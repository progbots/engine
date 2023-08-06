import { ValueType } from '../../index'
import { CycleResult, State, checkIDictionary } from '../../state/index'

/* eslint-disable no-labels */

export function begin ({ operands, dictionaries }: State): CycleResult {
  const [dict] = operands.check(ValueType.dict)
  assert: checkIDictionary(dict.data)
  dictionaries.begin(dict.data)
  operands.pop()
  return null
}

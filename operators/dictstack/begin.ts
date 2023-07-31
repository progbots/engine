import { IDictionary, ValueType } from '../../index'
import { CycleResult, State } from '../../state/index'

export function begin ({ operands, dictionaries }: State): CycleResult {
  const [dict] = operands.check(ValueType.dict)
  dictionaries.begin(dict.data as IDictionary)
  operands.pop()
  return null
}

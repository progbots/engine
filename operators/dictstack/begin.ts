import { IDictionary, ValueType } from '../../index'
import { AtomicResult, State } from '../../state/index'

export function begin ({ operands, dictionaries }: State): AtomicResult {
  const [dict] = operands.check(ValueType.dict)
  dictionaries.begin(dict.data as IDictionary)
  operands.pop()
  return null
}

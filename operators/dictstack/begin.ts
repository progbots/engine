import { IDictionary, ValueType } from '../../index'
import { State } from '../../state/index'

export function begin ({ operands, dictionaries }: State): undefined {
  const [dict] = operands.check(ValueType.dict)
  dictionaries.begin(dict.data as IDictionary)
  operands.pop()
}

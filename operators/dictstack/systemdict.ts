import { ValueType } from '../../index'
import { AtomicResult, State } from '../../state/index'

export function systemdict ({ operands, dictionaries }: State): AtomicResult {
  operands.push({
    type: ValueType.dict,
    data: dictionaries.systemdict
  })
  return null
}

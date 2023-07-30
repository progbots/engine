import { ValueType } from '../../index'
import { AtomicResult, State } from '../../state/index'

export function globaldict ({ operands, dictionaries }: State): AtomicResult {
  operands.push({
    type: ValueType.dict,
    data: dictionaries.globaldict
  })
  return null
}

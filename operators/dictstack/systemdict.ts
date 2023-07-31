import { ValueType } from '../../index'
import { CycleResult, State } from '../../state/index'

export function systemdict ({ operands, dictionaries }: State): CycleResult {
  operands.push({
    type: ValueType.dict,
    data: dictionaries.systemdict
  })
  return null
}

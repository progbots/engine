import { ValueType } from '../../index'
import { CycleResult, State } from '../../state/index'

export function globaldict ({ operands, dictionaries }: State): CycleResult {
  operands.push({
    type: ValueType.dict,
    data: dictionaries.globaldict
  })
  return null
}

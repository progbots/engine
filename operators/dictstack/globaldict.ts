import { ValueType } from '../../index'
import { State } from '../../state/index'

export function globaldict ({ operands, dictionaries }: State): undefined {
  operands.push({
    type: ValueType.dict,
    data: dictionaries.globaldict
  })
}

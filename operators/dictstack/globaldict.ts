import { ValueType } from '../../index'
import { State } from '../../state/index'

export function * globaldict ({ operands, dictionaries }: State): Generator {
  operands.push({
    type: ValueType.dict,
    data: dictionaries.globaldict
  })
}

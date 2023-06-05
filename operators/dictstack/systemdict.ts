import { ValueType } from '../../index'
import { State } from '../../state/index'

export function * systemdict ({ operands, dictionaries }: State): Generator {
  operands.push({
    type: ValueType.dict,
    data: dictionaries.systemdict
  })
}

import { ValueType } from '../../index'
import { State } from '../../state/index'

export function where ({ operands, dictionaries }: State): void {
  const [name] = operands.check(ValueType.string)
  const result = dictionaries.where(name.data as string)
  if (result === null) {
    operands.splice(1, {
      type: ValueType.boolean,
      data: false
    })
  } else {
    operands.splice(1, [{
      type: ValueType.dict,
      data: result.dict
    }, {
      type: ValueType.boolean,
      data: true
    }])
  }
}

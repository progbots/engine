import { ValueType } from '@api'
import { CycleResult, IInternalState } from '@sdk'

export function where ({ operands, dictionaries }: IInternalState): CycleResult {
  const [{ string }] = operands.check(ValueType.string)
  const result = dictionaries.where(string)
  if (result === null) {
    operands.splice(1, {
      type: ValueType.boolean,
      isSet: false
    })
  } else {
    operands.splice(1, [{
      type: ValueType.dictionary,
      dictionary: result.dictionary
    }, {
      type: ValueType.boolean,
      isSet: true
    }])
  }
  return null
}

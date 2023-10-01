import { ArrayValue, BlockValue, BooleanValue, CallValue, DictionaryValue, IntegerValue, OperatorValue, StringValue, Value, ValueType } from '@api'
import { CycleResult, IInternalState } from '@sdk'

const values: { [type in ValueType]: (value: Value<type>) => unknown } = {
  [ValueType.boolean]: (value: BooleanValue) => value.isSet,
  [ValueType.integer]: (value: IntegerValue) => value.number,
  [ValueType.string]: (value: StringValue) => value.string,
  [ValueType.mark]: () => null,
  [ValueType.block]: (value: BlockValue) => value.block,
  [ValueType.call]: (value: CallValue) => value.call,
  [ValueType.operator]: (value: OperatorValue) => value.operator,
  [ValueType.array]: (value: ArrayValue) => value.array,
  [ValueType.dictionary]: (value: DictionaryValue) => value.dictionary
}

function valueOf<T> (value: Value<T>): unknown {
  return values[value.type](value as never)
}

export function eq ({ operands }: IInternalState): CycleResult {
  const [value1, value2] = operands.check(null, null)
  operands.splice(2, {
    type: ValueType.boolean,
    isSet: value1.type === value2.type && valueOf(value1) === valueOf(value2)
  })
  return null
}

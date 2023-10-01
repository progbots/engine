import { ArrayValue, BlockValue, BooleanValue, CallValue, DictionaryValue, IntegerValue, OperatorValue, StringValue, Value, ValueType } from '@api'

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

export function valueOf (value: Value): unknown {
  return values[value.type](value as never)
}

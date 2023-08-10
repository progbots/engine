import {
  ValueType,
  Value,
  BooleanValue,
  IntegerValue,
  StringValue,
  BlockValue,
  CallValue,
  OperatorValue,
  ArrayValue,
  DictionaryValue
} from './Value'
import { InternalError } from './errors/InternalError'

function check (value: Value, expectedType: ValueType): void {
  if (value.type !== expectedType) {
    throw new InternalError(`Value is not of type '${expectedType}`)
  }
}

export function checkBooleanValue (value: Value): asserts value is BooleanValue {
  check(value, ValueType.boolean)
}

export function checkIntegerValue (value: Value): asserts value is IntegerValue {
  check(value, ValueType.integer)
}

export function checkStringValue (value: Value): asserts value is StringValue {
  check(value, ValueType.integer)
}

export function checkBlockValue (value: Value): asserts value is BlockValue {
  check(value, ValueType.block)
}

export function checkCallValue (value: Value): asserts value is CallValue {
  check(value, ValueType.call)
}

export function checkOperatorValue (value: Value): asserts value is OperatorValue {
  check(value, ValueType.operator)
}

export function checkArrayValue (value: Value): asserts value is ArrayValue {
  check(value, ValueType.array)
}

export function checkDictionaryValue (value: Value): asserts value is DictionaryValue {
  check(value, ValueType.dictionary)
}

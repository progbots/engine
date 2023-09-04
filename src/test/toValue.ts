import { Value, ValueType } from '@api'
import { InternalValue, scanGenericValue, scanOperatorFunction } from '@sdk'

export type CompatibleValue = string | number | Function | Value | InternalValue

export function toValue (value: CompatibleValue): Value {
  if (typeof value === 'string') {
    return {
      type: ValueType.string,
      string: value
    }
  }
  if (typeof value === 'number') {
    // TODO: asserts on integer
    return {
      type: ValueType.integer,
      number: value
    }
  }
  if (typeof value === 'function') {
    scanOperatorFunction(value)
    return {
      type: ValueType.operator,
      operator: value
    }
  }
  scanGenericValue(value)
  return value
}

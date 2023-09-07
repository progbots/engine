import {
  ArrayValue,
  BlockValue,
  BooleanValue,
  CallValue,
  DictionaryValue,
  IArray,
  IDictionary,
  IntegerValue,
  OperatorValue,
  StringValue,
  Value,
  ValueType,
  checkArrayValue,
  checkBlockValue,
  checkBooleanValue,
  checkCallValue,
  checkDictionaryValue,
  checkIntegerValue,
  checkOperatorValue,
  checkStringValue,
  throwValueIsNotOfType
} from '@api'
import { InternalError, InvalidAccess } from '@errors'
import { IOperatorFunction } from './IOperatorFunction'
import { IWritableDictionary } from './IWritableDictionary'
import { InternalValue } from './InternalValue'

const INVALID_VALUE = 'Invalid Value'

export function scanGenericValue (value: any): asserts value is InternalValue {
  if (typeof value !== 'object') {
    throw new InternalError(INVALID_VALUE)
  }
  const { type } = value
  if (!Object.values(ValueType).includes(type)) {
    throw new InternalError(INVALID_VALUE)
  }
}

function scan<T extends ValueType> (
  type: T,
  value: Value<T>,
  check: (value: Value<T>) => asserts value is Value<T>,
  scan: (value: Value<T>) => boolean
): void {
  try {
    scanGenericValue(value)
    check(value)
    if (!scan(value)) {
      throw Error()
    }
  } catch (e) {
    throwValueIsNotOfType(type)
  }
}

export function scanBooleanValue (value: any): asserts value is BooleanValue {
  scan(ValueType.boolean, value, checkBooleanValue, (value) => {
    const { isSet } = value
    return typeof isSet === 'boolean'
  })
}

export function scanIntegerValue (value: any): asserts value is IntegerValue {
  scan(ValueType.integer, value, checkIntegerValue, (value) => {
    const { number } = value
    return typeof number === 'number'
  })
}

export function scanStringValue (value: any): asserts value is StringValue {
  scan(ValueType.string, value, checkStringValue, (value) => {
    const { string } = value
    return typeof string === 'string'
  })
}

const INVALID_IARRAY = 'Invalid IArray'

export function scanIArray (value: any): asserts value is IArray {
  if (typeof value !== 'object') {
    throw new InternalError(INVALID_IARRAY)
  }
  const { length, at } = value
  if (typeof length !== 'number' || length < 0 || typeof at !== 'function' || at.length !== 1) {
    throw new InternalError(INVALID_IARRAY)
  }
}

export function scanBlockValue (value: any): asserts value is BlockValue {
  scan(ValueType.block, value, checkBlockValue, (value) => {
    const { block } = value
    scanIArray(block)
    return true
  })
}

export function scanCallValue (value: any): asserts value is CallValue {
  scan(ValueType.call, value, checkCallValue, (value) => {
    const { call } = value
    return typeof call === 'string'
  })
}

const INVALID_OPERATOR_FUNCTION = 'Invalid OperatorFunction'

export function scanOperatorFunction (value: any): asserts value is IOperatorFunction {
  const { name, constant, typeCheck, loop, catch: catchFunc, finally: finallyFunc } = value
  try {
    if (typeof value !== 'function' || typeof name !== 'string') {
      throw new Error()
    }
    if (constant !== undefined) {
      scanGenericValue(constant)
    }
    if (typeCheck !== undefined &&
      (!Array.isArray(typeCheck) || typeCheck.some(value => value !== null && !Object.values(ValueType).includes(value)))) {
      throw new Error()
    }
    if ((loop !== undefined && typeof loop !== 'function') ||
      (catchFunc !== undefined && typeof catchFunc !== 'function') ||
      (finallyFunc !== undefined && typeof finallyFunc !== 'function')) {
      throw new Error()
    }
  } catch (e) {
    throw new InternalError(INVALID_OPERATOR_FUNCTION)
  }
}

export function scanOperatorValue (value: any): asserts value is OperatorValue {
  scan(ValueType.operator, value, checkOperatorValue, (value) => {
    const { operator } = value
    scanOperatorFunction(operator)
    return true
  })
}

export function scanArrayValue (value: any): asserts value is ArrayValue {
  scan(ValueType.array, value, checkArrayValue, (value) => {
    const { array } = value
    scanIArray(array)
    return true
  })
}

const INVALID_IDICTIONARY = 'Not an IDictionary'

export function scanIDictionary (value: any): asserts value is IDictionary {
  if (typeof value !== 'object') {
    throw new InternalError(INVALID_IDICTIONARY)
  }
  const { names, lookup } = value
  if (!Array.isArray(names) || !names.every(name => typeof name === 'string') || typeof lookup !== 'function' || lookup.length !== 1) {
    throw new InternalError(INVALID_IDICTIONARY)
  }
}

export function scanIWritableDictionary (dict: any): asserts dict is IWritableDictionary {
  const { def } = dict
  if (typeof def !== 'function' || def.length !== 2) {
    throw new InvalidAccess()
  }
  scanIDictionary(dict)
}

export function scanDictionaryValue (value: any): asserts value is DictionaryValue {
  scan(ValueType.dictionary, value, checkDictionaryValue, (value) => {
    const { dictionary } = value
    scanIDictionary(dictionary)
    return true
  })
}

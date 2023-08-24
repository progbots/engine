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

function buildScan<T> (
  type: ValueType,
  check: (value: any) => asserts value is T,
  scan: (value: T) => boolean
): (value: any) => asserts value is T {
  return function (value: any) {
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
}

export const scanBooleanValue = buildScan<BooleanValue>(
  ValueType.boolean,
  checkBooleanValue,
  (value) => {
    const { isSet } = value
    return typeof isSet === 'boolean'
  }
)

export const scanIntegerValue = buildScan<IntegerValue>(
  ValueType.integer,
  checkIntegerValue,
  (value) => {
    const { number } = value
    return typeof number === 'number'
  }
)

export const scanStringValue = buildScan<StringValue>(
  ValueType.string,
  checkStringValue,
  (value) => {
    const { string } = value
    return typeof string === 'string'
  }
)

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

export const scanBlockValue = buildScan<BlockValue>(
  ValueType.block,
  checkBlockValue,
  (value) => {
    const { block } = value
    scanIArray(block)
    return true
  }
)

export const scanCallValue = buildScan<CallValue>(
  ValueType.call,
  checkCallValue,
  (value) => {
    const { call } = value
    return typeof call === 'string'
  }
)

const INVALID_OPERATOR_FUNCTION = 'Invalid OperatorFunction'

export function checkOperatorFunction (value: any): asserts value is IOperatorFunction {
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

export const scanOperatorValue = buildScan<OperatorValue>(
  ValueType.operator,
  checkOperatorValue,
  (value) => {
    const { operator } = value
    checkOperatorFunction(operator)
    return true
  }
)

export const scanArrayValue = buildScan<ArrayValue>(
  ValueType.array,
  checkArrayValue,
  (value) => {
    const { array } = value
    scanIArray(array)
    return true
  }
)

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

export const scanDictionaryValue = buildScan<DictionaryValue>(
  ValueType.dictionary,
  checkDictionaryValue,
  (value) => {
    const { dictionary } = value
    scanIDictionary(dictionary)
    return true
  }
)

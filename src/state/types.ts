import { InternalError } from '../src/errors/InternalError'
import { BlockValue, BooleanValue, CallValue, DictValue, EngineSignal, IArray, IDictionary, IntegerValue, OperatorValue, StringValue, Value, ValueType } from '../index'
import { State } from './State'

export interface DebugInfos {
  source?: string // Source code
  sourcePos?: number // Position in the source code
  sourceFile?: string // Source file name (if any)
}

type Internal<T> = T & DebugInfos & {
  untracked?: boolean // Disable memory tracking for the value
}

export type InternalValue = Internal<Value>

export type CycleResult = EngineSignal | InternalValue | null

export interface OperatorAttributes {
  name?: string
  constant?: Value
  // When specified, the collected values are kept valid during the operator lifetime (including catch & finally)
  typeCheck?: Array<ValueType | null>
  // When specified, the method is called until the result is false
  loop?: (state: State, parameters: readonly InternalValue[], index: number) => CycleResult | false
  // When specified, any InternalError is transmitted to it
  catch?: (state: State, parameters: readonly InternalValue[], e: InternalError) => CycleResult
  // When specified, triggered before unstacking the operator from call stack
  finally?: (state: State, parameters: readonly InternalValue[]) => CycleResult
}

export interface OperatorFunction extends OperatorAttributes {
  (state: State, parameters: readonly InternalValue[]): CycleResult
  name: string
}

export function isA<T> (checker: (value: any) => asserts value is T): (value: any) => value is T {
  return function (value: any): value is T {
    try {
      checker(value)
      return true
    } catch (e) {
      return false
    }
  }
}

const NOT_AN_OPERATOR_FUNCTION = 'Not an OperatorFunction'

export function checkOperatorFunction (value: any): asserts value is OperatorFunction {
  const { name, constant, typeCheck, loop, catch: catchFunc, finally: finallyFunc } = value
  try {
    if (typeof value !== 'function' || typeof name !== 'string') {
      throw new Error()
    }
    if (constant !== undefined) {
      checkGenericValue(constant)
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
    throw new InternalError(NOT_AN_OPERATOR_FUNCTION)
  }
}

const NOT_A_VALUE = 'Not a Value'

export function checkGenericValue (value: any): asserts value is Value {
  if (typeof value !== 'object') {
    throw new InternalError(NOT_A_VALUE)
  }
  const { type, data } = value
  if (!Object.values(ValueType).includes(type) || data === undefined) {
    throw new InternalError(NOT_A_VALUE)
  }
}

const NOT_A_BOOLEAN_VALUE = 'Not a BooleanValue'

export function checkBooleanValue (value: any): asserts value is BooleanValue {
  checkGenericValue(value)
  const { type, data } = value
  if (type !== ValueType.boolean || typeof data !== 'boolean') {
    throw new InternalError(NOT_A_BOOLEAN_VALUE)
  }
}
export const isBooleanValue = isA(checkBooleanValue)

const NOT_AN_INTEGER_VALUE = 'Not an IntegerValue'

export function checkIntegerValue (value: any): asserts value is IntegerValue {
  checkGenericValue(value)
  const { type, data } = value
  if (type !== ValueType.integer || typeof data !== 'number') {
    throw new InternalError(NOT_AN_INTEGER_VALUE)
  }
}
export const isIntegerValue = isA(checkIntegerValue)

const NOT_A_STRING_VALUE = 'Not a StringValue'

export function checkStringValue (value: any): asserts value is StringValue {
  checkGenericValue(value)
  const { type, data } = value
  if (type !== ValueType.string || typeof data !== 'string') {
    throw new InternalError(NOT_A_STRING_VALUE)
  }
}
export const isStringValue = isA(checkStringValue)

const NOT_A_CALL_VALUE = 'Not a CallValue'

export function checkCallValue (value: any): asserts value is CallValue {
  checkGenericValue(value)
  const { type, data } = value
  if (type !== ValueType.call || typeof data !== 'string' || data === '') {
    throw new InternalError(NOT_A_CALL_VALUE)
  }
}
export const isCallValue = isA(checkCallValue)

const NOT_AN_OPERATOR_VALUE = 'Not an OperatorValue'

export function checkOperatorValue (value: any): asserts value is OperatorValue {
  checkGenericValue(value)
  const { type, data } = value
  if (type !== ValueType.operator || typeof data !== 'function') {
    throw new InternalError(NOT_AN_OPERATOR_VALUE)
  }
}
export const isOperatorValue = isA(checkOperatorValue)

const NOT_AN_IARRAY = 'Not an IArray'

export function checkIArray (value: any): asserts value is IArray {
  if (typeof value !== 'object') {
    throw new InternalError(NOT_AN_IARRAY)
  }
  const { length, at } = value
  if (typeof length !== 'number' || length < 0 || typeof at !== 'function' || at.length !== 1) {
    throw new InternalError(NOT_AN_IARRAY)
  }
}

const NOT_A_BLOCK_VALUE = 'Not a BlockValue'

export function checkBlockValue (value: any): asserts value is BlockValue {
  checkGenericValue(value)
  const { type, data } = value
  if (type !== ValueType.block) {
    throw new InternalError(NOT_A_BLOCK_VALUE)
  }
  checkIArray(data)
}
export const isBlockValue = isA(checkBlockValue)

const NOT_AN_IDICTIONARY = 'Not an IDictionary'

export function checkIDictionary (value: any): asserts value is IDictionary {
  if (typeof value !== 'object') {
    throw new InternalError(NOT_AN_IDICTIONARY)
  }
  const { names, lookup } = value
  if (!Array.isArray(names) || !names.every(name => typeof name === 'string') || typeof lookup !== 'function' || lookup.length !== 1) {
    throw new InternalError(NOT_AN_IDICTIONARY)
  }
}

const NOT_A_DICT_VALUE = 'Not a DictValue'

export function checkDictValue (value: any): asserts value is DictValue {
  checkGenericValue(value)
  const { type, data } = value
  if (type !== ValueType.dict) {
    throw new InternalError(NOT_A_DICT_VALUE)
  }
  checkIDictionary(data)
}
export const isDictValue = isA(checkDictValue)

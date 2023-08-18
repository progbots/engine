import {
  ArrayValue,
  BlockValue,
  BooleanValue,
  CallValue,
  DictionaryValue,
  IArray,
  IDictionary,
  IState,
  IntegerValue,
  OperatorValue,
  Signal,
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
} from '../index'
import { InternalError } from '../errors/InternalError'
import { OperandStack } from '../objects/stacks'

export interface DebugInfos {
  source?: string // Source code
  sourcePos?: number // Position in the source code
  sourceFile?: string // Source file name (if any)
}

type Internal<T> = T & DebugInfos & {
  untracked?: boolean // Disable memory tracking for the value
}

export type InternalValue = Internal<Value>

export type CycleResult = Signal | InternalValue | null

export interface IInternalState extends IState {
  operands: OperandStack
}

const INVALID_VALUE = 'Invalid Value'

function scanGenericValue (value: any): asserts value is Value {
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

export function checkIArray (value: any): asserts value is IArray {
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
    checkIArray(block)
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

export interface OperatorAttributes {
  name?: string
  constant?: Value
  // When specified, the collected values are kept valid during the operator lifetime (including catch & finally)
  typeCheck?: Array<ValueType | null>
  // When specified, the method is called until the result is false
  loop?: (state: IInternalState, parameters: readonly InternalValue[], index: number) => CycleResult | false
  // When specified, any InternalError is transmitted to it
  catch?: (state: IInternalState, parameters: readonly InternalValue[], e: InternalError) => CycleResult
  // When specified, triggered before unstacking the operator from call stack
  finally?: (state: IInternalState, parameters: readonly InternalValue[]) => CycleResult
}

export interface OperatorFunction extends OperatorAttributes {
  (state: IInternalState, parameters: readonly InternalValue[]): CycleResult
  name: string
}

const INVALID_OPERATOR_FUNCTION = 'Invalid OperatorFunction'

export function checkOperatorFunction (value: any): asserts value is OperatorFunction {
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
    checkIArray(array)
    return true
  }
)

const INVALID_IDICTIONARY = 'Not an IDictionary'

export function checkIDictionary (value: any): asserts value is IDictionary {
  if (typeof value !== 'object') {
    throw new InternalError(INVALID_IDICTIONARY)
  }
  const { names, lookup } = value
  if (!Array.isArray(names) || !names.every(name => typeof name === 'string') || typeof lookup !== 'function' || lookup.length !== 1) {
    throw new InternalError(INVALID_IDICTIONARY)
  }
}

export const scanDictionaryValue = buildScan<DictionaryValue>(
  ValueType.dictionary,
  checkDictionaryValue,
  (value) => {
    const { dictionary } = value
    checkIDictionary(dictionary)
    return true
  }
)

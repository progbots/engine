import { InternalError } from '../errors/InternalError'
import { BlockValue, BooleanValue, EngineSignal, IArray, Value, ValueType } from '../index'
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

export type CycleResult = EngineSignal | Internal<BlockValue> | null

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

const NOT_A_VALUE = 'Not a Value'

function checkGenericValue (value: any): asserts value is Value {
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

const NOT_AN_IARRAY = 'Not an IArray'

function checkIArray (value: any): asserts value is IArray {
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

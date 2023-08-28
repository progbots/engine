import { ValueType, Value } from '@api'
import { IStack } from './IStack'
import { Internal, InternalValue } from './InternalValue'

export interface IOperandStack extends IStack {
  splice: (count: number, values?: InternalValue | InternalValue[]) => void
  check: (<T extends ValueType>(type: T | null) => readonly [Internal<Value<T>>]) &
  (<T1 extends ValueType, T2 extends ValueType>(type1: T1 | null, type2: T2 | null) => readonly [Internal<Value<T1>>, Internal<Value<T2>>]) &
  (<T1 extends ValueType, T2 extends ValueType, T3 extends ValueType>(type1: T1 | null, type2: T2 | null, type3: T3 | null) => readonly [Internal<Value<T1>>, Internal<Value<T2>>, Internal<Value<T3>>]) &
  ((...types: Array<ValueType | null>) => readonly InternalValue[])
  findMarkPos: () => number
}

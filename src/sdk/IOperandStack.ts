import { ArrayValue, BlockValue, BooleanValue, CallValue, DictionaryValue, IntegerValue, OperatorValue, StringValue, ValueType } from '@api'
import { IStack } from './IStack'
import { Internal, InternalValue } from './InternalValue'

export interface IOperandStack extends IStack {
  splice: (count: number, values?: InternalValue | InternalValue[]) => void
  check: ((type: ValueType.boolean) => readonly [Internal<BooleanValue>]) &
  ((type: ValueType.integer) => readonly [Internal<IntegerValue>]) &
  ((type: ValueType.string) => readonly [Internal<StringValue>]) &
  ((type: ValueType.block) => readonly [Internal<BlockValue>]) &
  ((type: ValueType.call) => readonly [Internal<CallValue>]) &
  ((type: ValueType.operator) => readonly [Internal<OperatorValue>]) &
  ((type: ValueType.array) => readonly [Internal<ArrayValue>]) &
  ((type: ValueType.dictionary) => readonly [Internal<DictionaryValue>]) &
  ((type: null) => readonly [InternalValue]) &
  ((type1: ValueType | null, type2: ValueType | null) => readonly [InternalValue, InternalValue]) &
  ((type1: ValueType | null, type2: ValueType | null, type3: ValueType | null) => readonly [InternalValue, InternalValue, InternalValue]) &
  ((...types: Array<ValueType | null>) => readonly InternalValue[])
  findMarkPos: () => number
}

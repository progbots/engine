import { ArrayValue, BlockValue, BooleanValue, CallValue, DictionaryValue, IntegerValue, OperatorValue, StringValue, ValueType } from '@api'
import { IOperandStack, Internal, InternalValue } from '@sdk'
import { StackUnderflow, TypeCheck, UnmatchedMark } from '@errors'
import { ValueStack } from './ValueStack'

export class OperandStack extends ValueStack implements IOperandStack {
  check (type: ValueType.boolean): readonly [Internal<BooleanValue>]
  check (type: ValueType.integer): readonly [Internal<IntegerValue>]
  check (type: ValueType.string): readonly [Internal<StringValue>]
  check (type: ValueType.block): readonly [Internal<BlockValue>]
  check (type: ValueType.call): readonly [Internal<CallValue>]
  check (type: ValueType.operator): readonly [Internal<OperatorValue>]
  check (type: ValueType.array): readonly [Internal<ArrayValue>]
  check (type: ValueType.dictionary): readonly [Internal<DictionaryValue>]
  check (type: null): readonly [InternalValue]
  check (type1: ValueType | null, type2: ValueType | null): readonly [InternalValue, InternalValue]
  check (type1: ValueType | null, type2: ValueType | null, type3: ValueType | null): readonly [InternalValue, InternalValue, InternalValue]
  check (...types: Array<ValueType | null>): readonly InternalValue[] {
    if (types.length > this._values.length) {
      throw new StackUnderflow()
    }
    return types.map((type: ValueType | null, pos: number): InternalValue => {
      const value = this.safeAt(pos)
      if (type !== null && value.type !== type) {
        throw new TypeCheck()
      }
      return value
    })
  }

  findMarkPos (): number {
    const pos = this._values.findIndex((value: InternalValue) => value.type === ValueType.mark)
    if (pos === -1) {
      throw new UnmatchedMark()
    }
    return pos
  }
}

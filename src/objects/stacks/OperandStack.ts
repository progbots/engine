import { Value, ValueType } from '@api'
import { IOperandStack, Internal, InternalValue } from '@sdk'
import { StackUnderflow, TypeCheck, UnmatchedMark } from '@errors'
import { ValueStack } from './ValueStack'

export class OperandStack extends ValueStack implements IOperandStack {
  check<T extends ValueType> (type: T | null): readonly [Internal<Value<T>>]
  check<T1 extends ValueType, T2 extends ValueType> (type1: T1 | null, type2: T2 | null): readonly [Internal<Value<T1>>, Internal<Value<T2>>]
  check<T1 extends ValueType, T2 extends ValueType, T3 extends ValueType> (type1: T1 | null, type2: T2 | null, type3: T3 | null): readonly [Internal<Value<T1>>, Internal<Value<T2>>, Internal<Value<T3>>]
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

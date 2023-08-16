import { ValueType } from '../../index'
import { StackUnderflow, TypeCheck, UnmatchedMark } from '../../errors/index'
import { InternalValue } from '../../state/index'
import { ValueStack } from './ValueStack'

export class OperandStack extends ValueStack {
  check (...types: Array<ValueType | null>): InternalValue[] {
    if (types.length > this._values.length) {
      throw new StackUnderflow()
    }
    return types.map((type: ValueType | null, pos: number): InternalValue => {
      const value = this._values[pos]
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

import { ValueType } from '../../index'
import { StackUnderflow, TypeCheck, UnmatchedMark } from '../../errors/index'
import { InternalValue } from '../../state/index'
import { Stack } from './Stack'

export class OperandStack extends Stack {
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

  splice (count: number, ...values: InternalValue[]): void {
    if (this._values.length < count) {
      throw new StackUnderflow()
    }
    this._values.splice(0, count, ...values.reverse())
  }

  findMarkPos (): number {
    const pos = this._values.findIndex((value: InternalValue) => value.type === ValueType.mark)
    if (pos === -1) {
      throw new UnmatchedMark()
    }
    return pos
  }
}

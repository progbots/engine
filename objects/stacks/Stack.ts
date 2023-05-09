import { StackUnderflow } from '../../errors/index'
import { InternalValue } from '../../state/index'
import { BaseArray } from '../BaseArray'

export class Stack extends BaseArray {
  protected pushImpl (value: InternalValue): void {
    this._values.unshift(value)
  }

  protected popImpl (): InternalValue {
    return this._values.shift() as InternalValue
  }

  pop (): void {
    if (this._values.length === 0) {
      throw new StackUnderflow()
    }
    super.pop()
  }
}

import { StackUnderflow } from '../../src/errors/index'
import { InternalValue, checkGenericValue } from '../../state/index'
import { BaseArray } from '../BaseArray'

/* eslint-disable no-labels */

export class Stack extends BaseArray {
  protected pushImpl (value: InternalValue): void {
    this._values.unshift(value)
  }

  protected popImpl (): InternalValue {
    const value = this._values.shift()
    assert: checkGenericValue(value)
    return value
  }

  pop (): void {
    if (this._values.length === 0) {
      throw new StackUnderflow()
    }
    super.pop()
  }

  splice (count: number, values?: InternalValue | InternalValue[]): void {
    if (this.length < count) {
      throw new StackUnderflow()
    }
    const removedValues = this._values.splice(0, count)
    if (values !== undefined) {
      if (!Array.isArray(values)) {
        values = [values]
      }
      for (const value of values) {
        this.push(value)
      }
    }
    for (const value of removedValues) {
      this.releaseValue(value)
    }
  }
}

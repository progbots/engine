import { InternalValue } from '@sdk'
import { Internal, RangeCheck, InternalError } from '@errors'
import { BaseValueArray } from './BaseValueArray'

const EMPTY_ARRAY = 'Empty array'
const NOT_A_VALUEARRAY = 'Not a ValueArray'

export class ValueArray extends BaseValueArray {
  static check (value: any): asserts value is ValueArray {
    if (typeof value !== 'object' || !(value instanceof ValueArray)) {
      throw new InternalError(NOT_A_VALUEARRAY)
    }
  }

  protected pushImpl (value: InternalValue): void {
    this._values.push(value)
  }

  protected popImpl (): InternalValue {
    const values = this.getNonEmptyValueArray()
    const value = values[values.length - 1]
    values.pop()
    return value
  }

  shift (): InternalValue {
    const value = this._values.shift()
    if (value === undefined) {
      throw new Internal(EMPTY_ARRAY)
    }
    this.releaseValue(value)
    return value
  }

  unshift (value: InternalValue): void {
    this.addValueRef(value)
    this._values.unshift(value)
  }

  set (index: number, value: InternalValue): void {
    if (index < 0) {
      throw new RangeCheck()
    }
    const oldValue = this._values[index]
    this.addValueRef(value)
    if (oldValue !== undefined) {
      this.releaseValue(oldValue)
    }
    this._values[index] = value
  }

  some (predicate: (value: InternalValue, index: number) => boolean): boolean {
    return this._values.some(predicate)
  }
}

import { InternalValue } from '../state/index'
import { Internal, RangeCheck } from '../errors/index'
import { BaseArray } from './BaseArray'

const EMPTY_ARRAY = 'Empty array'

export class ArrayLike extends BaseArray {
  protected pushImpl (value: InternalValue): void {
    this._values.push(value)
  }

  protected popImpl (): InternalValue {
    const value = this._values.at(-1) as InternalValue
    this._values.pop()
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

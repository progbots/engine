import { InternalValue } from '../state'
import { Internal, RangeCheck } from '../errors'
import { BaseArray } from './BaseArray'

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
      throw new Internal('array is empty')
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
}

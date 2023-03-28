import { Value } from '..'
import { Internal, RangeCheck } from '../errors'
import { BaseArray } from './BaseArray'

export class ArrayLike extends BaseArray {
  protected pushImpl (value: Value): void {
    this._values.push(value)
  }

  protected popImpl (): Value {
    const value = this._values.at(-1) as Value
    this._values.pop()
    return value
  }

  shift (): Value {
    const value = this._values.shift()
    if (value === undefined) {
      throw new Internal('array is empty')
    }
    this.releaseValue(value)
    return value
  }

  unshift (value: Value): void {
    this.addValueRef(value)
    this._values.unshift(value)
  }

  set (index: number, value: Value): void {
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

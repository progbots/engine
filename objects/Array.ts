import { ValueEx } from '../state'
import { Internal, RangeCheck } from '../errors'
import { BaseArray } from './BaseArray'

export class ArrayLike extends BaseArray {
  protected pushImpl (value: ValueEx): void {
    this._values.push(value)
  }

  protected popImpl (): ValueEx {
    const value = this._values.at(-1) as ValueEx
    this._values.pop()
    return value
  }

  shift (): ValueEx {
    const value = this._values.shift()
    if (value === undefined) {
      throw new Internal('array is empty')
    }
    this.releaseValue(value)
    return value
  }

  unshift (value: ValueEx): void {
    this.addValueRef(value)
    this._values.unshift(value)
  }

  set (index: number, value: ValueEx): void {
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

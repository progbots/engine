import { Value } from '..'
import { BaseArray } from './BaseArray'

export class Stack extends BaseArray {
  protected pushImpl (value: Value): void {
    this._values.unshift(value)
  }

  protected popImpl (): Value {
    return this._values.shift() as Value
  }
}

import { Value } from '..'
import { BaseArray } from './BaseArray'

export class Array extends BaseArray {
  protected pushImpl (value: Value): void {
    this._values.push(value)
  }

  protected popImpl (): Value {
    const value = this._values.at(-1) as Value
    this._values.pop()
    return value
  }
}

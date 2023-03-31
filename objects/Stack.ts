import { Value } from '..'
import { ValueEx } from '../state'
import { BaseArray } from './BaseArray'

export class Stack extends BaseArray {
  protected pushImpl (value: ValueEx): void {
    this._values.unshift(value)
  }

  protected popImpl (): ValueEx {
    return this._values.shift() as Value
  }
}

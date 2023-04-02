import { InternalValue } from '../state'
import { BaseArray } from './BaseArray'

export class Stack extends BaseArray {
  protected pushImpl (value: InternalValue): void {
    this._values.unshift(value)
  }

  protected popImpl (): InternalValue {
    return this._values.shift() as InternalValue
  }
}

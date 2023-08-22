import { ValueType } from './ValueType'

export interface IntegerValue {
  readonly type: ValueType.integer
  readonly number: number
}

import { ValueType } from './ValueType'

export interface CallValue {
  readonly type: ValueType.call
  readonly call: string
}

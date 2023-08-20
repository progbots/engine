import { ValueType } from './ValueType'

export interface BooleanValue {
  readonly type: ValueType.boolean
  readonly isSet: boolean
}

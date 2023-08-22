import { ValueType } from './ValueType'

export interface StringValue {
  readonly type: ValueType.string
  readonly string: string
}

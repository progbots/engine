import { IArray } from './IArray'
import { ValueType } from './ValueType'

export interface ArrayValue {
  readonly type: ValueType.array
  readonly array: IArray
}

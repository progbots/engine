import { IArray } from './IArray'
import { ValueType } from './ValueType'

export interface BlockValue {
  readonly type: ValueType.block
  readonly block: IArray
}

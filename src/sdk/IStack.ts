import { IArray } from '../api/IArray'
import { InternalValue } from './InternalValue'

export interface IStack extends IArray {
  readonly ref: readonly InternalValue[]
  push: (value: InternalValue) => void
  pop: () => void
}

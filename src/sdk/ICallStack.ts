import { IStack } from './IStack'
import { InternalValue } from './InternalValue'

export interface ICallStack extends IStack {
  readonly top: InternalValue
  step: number
  index: number
  parameters: readonly InternalValue[]
  pushParameter: (value: InternalValue) => void
  popParameter: () => void
}

import { InternalValue } from './InternalValue'

export interface IMemoryTracker {
  addValueRef: (value: InternalValue) => void
  releaseValue: (value: InternalValue) => void
  increment: (bytes: number) => void
  decrement: (bytes: number) => void
}

import { InternalValue } from './InternalValue'

export const MEMORY_POINTER_SIZE = 4
export const MEMORY_INTEGER_SIZE = 4
export const MEMORY_VALUE_TYPE_SIZE = 1
export const MEMORY_VALUE_SIZE = MEMORY_VALUE_TYPE_SIZE + MEMORY_POINTER_SIZE

export interface IMemoryTracker {
  addValueRef: (value: InternalValue) => void
  releaseValue: (value: InternalValue) => void
  increment: (bytes: number) => void
  decrement: (bytes: number) => void
}

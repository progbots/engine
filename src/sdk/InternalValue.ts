import { Value } from '@api'
import { DebugInfos } from './DebugInfos'

export type Internal<T> = T & {
  debug?: DebugInfos
  untracked?: boolean // Disable memory tracking for the value
}

export type InternalValue = Internal<Value>

export function checkInternalValue (value: Value): asserts value is InternalValue {
  // Since additional members are optionals, nothing to check
}

export function getDebugInfos (value: Value | InternalValue): DebugInfos | undefined {
  checkInternalValue(value)
  return value.debug
}

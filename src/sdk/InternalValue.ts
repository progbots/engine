import { Value } from '@api'
import { DebugInfos } from './DebugInfos'

type Internal<T> = T & DebugInfos & {
  untracked?: boolean // Disable memory tracking for the value
}

export type InternalValue = Internal<Value>

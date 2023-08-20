import { Value } from '../api/index'
import { DebugInfos } from './DebugInfos'

type Internal<T> = T & DebugInfos & {
  untracked?: boolean // Disable memory tracking for the value
}

export type InternalValue = Internal<Value>

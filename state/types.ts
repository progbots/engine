import { Value } from '../index'
import { State } from './State'

export interface OperatorFunction {
  (state: State): undefined | Generator
  name: string
}

export interface DebugInfos {
  source?: string // Source code
  sourcePos?: number // Position in the source code
  sourceFile?: string // Source file name (if any)
}

export type InternalValue = Value & DebugInfos & {
  untracked?: boolean // Disable memory tracking for the value
}

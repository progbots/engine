import { Value } from '../index'
import { State } from './State'

export interface OperatorFunction {
  (state: State): void
  name: string
}

export type InternalValue = Value & {
  untracked?: boolean // Disable memory tracking for the value
  source?: string // Source code
  sourcePos?: number // Position in the source code
  sourceFile?: string // Source file name (if any)
}

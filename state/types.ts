import { Value } from '..'
import { State } from './State'

export type OperatorFunction = (state: State) => Generator

export interface InternalValue extends Value {
  untracked?: boolean // Disable memory tracking for the value
  source?: string // Source code
  sourcePos?: number // Position in the source code
  sourceFile?: string // Source file name (if any)
}

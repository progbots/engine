import { Value } from '..'
import { State } from './State'

export type OperatorFunction = (state: State) => Generator

export interface ValueEx extends Value {
  untracked?: boolean
  source?: string
  sourceFile?: string
  sourcePos?: number
}

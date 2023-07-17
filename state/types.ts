import { InternalError } from '../errors/InternalError'
import { Value, ValueType } from '../index'
import { State } from './State'

export interface OperatorAttributes {
  name?: string
  typeCheck?: (ValueType|null)[] // When specified, also ensure shareable objects remain referenced during operator lifetime (including catch & finally)
  catch?: (state: State, parameters: InternalValue[], e: InternalError) => undefined | Generator
  finally?: (state: State, parameters: InternalValue[]) => undefined | Generator
}

export interface OperatorFunction extends OperatorAttributes {
  (state: State, parameters: InternalValue[]): undefined | Generator
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

import { InternalError } from '../errors/InternalError'
import { Value, ValueType } from '../index'
import { State } from './State'

export interface OperatorAttributes {
  name?: string
  constant?: Value
  // When specified, the collected values are kept valid during the operator lifetime (including catch & finally)  
  typeCheck?: Array<ValueType | null>
  // When specified, the method is called until the result is false
  loop?: (state: State, parameters: InternalValue[]) => boolean
  // When specified, any InternalError is transmitted to it
  catch?: (state: State, parameters: InternalValue[], e: InternalError) => void
  // When specified, triggered before unstacking the operator from call stack
  finally?: (state: State, parameters: InternalValue[]) => void
}

export interface OperatorFunction extends OperatorAttributes {
  (state: State, parameters: InternalValue[]): void
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

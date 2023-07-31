import { InternalError } from '../errors/InternalError'
import { EngineSignal, Value, ValueType } from '../index'
import { State } from './State'

export type CycleResult = EngineSignal | InternalValue | null

export interface OperatorAttributes {
  name?: string
  constant?: Value
  // When specified, the collected values are kept valid during the operator lifetime (including catch & finally)
  typeCheck?: Array<ValueType | null>
  // When specified, the method is called until the result is false
  loop?: (state: State, parameters: readonly InternalValue[], index: number) => CycleResult | false
  // When specified, any InternalError is transmitted to it
  catch?: (state: State, parameters: readonly InternalValue[], e: InternalError) => CycleResult
  // When specified, triggered before unstacking the operator from call stack
  finally?: (state: State, parameters: readonly InternalValue[]) => CycleResult
}

export interface OperatorFunction extends OperatorAttributes {
  (state: State, parameters: readonly InternalValue[]): CycleResult
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

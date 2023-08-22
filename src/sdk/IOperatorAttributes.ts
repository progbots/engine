import { Value, ValueType } from '@api'
import { CycleResult } from './CycleResult'
import { IError } from './IError'
import { IInternalState } from './IInternalState'
import { InternalValue } from './InternalValue'

export interface IOperatorAttributes {
  constant?: Value
  // When specified, the collected values are kept valid during the operator lifetime (including catch & finally)
  typeCheck?: Array<ValueType | null>
  // When specified, the method is called until the result is false
  loop?: (state: IInternalState, parameters: readonly InternalValue[], index: number) => CycleResult | false
  // When specified, any InternalError is transmitted to it
  catch?: (state: IInternalState, parameters: readonly InternalValue[], e: IError) => CycleResult
  // When specified, triggered before unstacking the operator from call stack
  finally?: (state: IInternalState, parameters: readonly InternalValue[]) => CycleResult
}

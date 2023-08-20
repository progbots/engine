import { IOperator } from '../api/IOperator'
import { CycleResult } from './CycleResult'
import { IInternalState } from './IInternalState'
import { IOperatorAttributes } from './IOperatorAttributes'
import { InternalValue } from './InternalValue'

export interface IOperatorFunction extends IOperator, IOperatorAttributes {
  (state: IInternalState, parameters: readonly InternalValue[]): CycleResult
}

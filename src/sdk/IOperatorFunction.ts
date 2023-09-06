import { IOperator } from '@api'
import { CycleResult } from './CycleResult'
import { IInternalState } from './IInternalState'
import { IOperatorAttributes } from './IOperatorAttributes'
import { InternalValue } from './InternalValue'

export interface IOperatorFunction<T1 = any, T2 = any, T3 = any> extends IOperator, IOperatorAttributes {
  (state: IInternalState, op1: InternalValue<T1>, op2: InternalValue<T2>, op3: InternalValue<T3>): CycleResult
}

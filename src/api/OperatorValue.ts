import { IOperator } from './IOperator'
import { ValueType } from './ValueType'

export interface OperatorValue {
  readonly type: ValueType.operator
  readonly operator: IOperator
}

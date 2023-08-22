import { ValueType } from '../api'
import { IStack } from './IStack'
import { InternalValue } from './InternalValue'

export interface IOperandStack extends IStack {
  splice: (count: number, values?: InternalValue | InternalValue[]) => void
  check: (...types: Array<ValueType | null>) => readonly InternalValue[]
  findMarkPos: () => number
}

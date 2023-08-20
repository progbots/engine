import { IState } from '../api/IState'
import { ICallStack } from './ICallStack'
import { IDictionaryStack } from './IDictionaryStack'
import { IOperandStack } from './IOperandStack'

export interface IInternalState extends IState {
  readonly operands: IOperandStack
  readonly dictionaries: IDictionaryStack
  readonly calls: ICallStack
}

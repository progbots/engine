import { IState } from '@api'
import { ICallStack } from './ICallStack'
import { IDictionaryStack } from './IDictionaryStack'
import { IMemoryTracker } from './IMemoryTracker'
import { IOperandStack } from './IOperandStack'

export interface IInternalState extends IState {
  readonly memoryTracker: IMemoryTracker
  readonly operands: IOperandStack
  readonly dictionaries: IDictionaryStack
  readonly calls: ICallStack
}

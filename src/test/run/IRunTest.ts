import { IStateFlags } from '@api'
import { CycleResult, InternalValue } from '@sdk'
import { ITest } from '../ITest'

export interface IRunTest extends ITest {
  before: {
    flags?: Partial<IStateFlags>
    callStack: InternalValue[]
    step?: number
    index?: number
    parameters?: InternalValue[]
  }
  error?: Function
  after?: {
    result?: CycleResult
    step: number
    index?: number
    parameters?: InternalValue[]
  }
}

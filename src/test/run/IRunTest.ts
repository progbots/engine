import { IStateFlags } from '@api'
import { CycleResult, InternalValue } from '@sdk'
import { ITest } from '../ITest'

export interface IRunTest extends ITest {
  before: {
    step?: number // 0 (init) if not specified
    flags?: Partial<IStateFlags>
    callStack: InternalValue[]
    index?: number
    parameters?: InternalValue[]
  }
  error?: Function
  after?: {
    step?: number // RUN_STEP_END if not specified
    result?: CycleResult // null if not specified
    index?: number
    parameters?: InternalValue[],
    operands?: InternalValue[]
  }
}

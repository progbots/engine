import { Value } from '@api'
import { IInternalState, IOperatorFunction } from '@sdk'
import { ITest } from '../ITest'

export interface IStateTest extends ITest {
  src: string
  cycles?: number // default to 1
  error?: Function // Subclass of InternalError
  expect?: Value[] | string | ((state: IInternalState, exceptionCaught?: Error) => void)
  host?: Record<string, IOperatorFunction>
  cleanBeforeCheckingForLeaks?: string
}

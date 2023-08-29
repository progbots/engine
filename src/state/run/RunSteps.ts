import { Value } from '@api'
import { CycleResult, IInternalState, Internal } from '@sdk'

export const RUN_STEP_END = -1
export const RUN_STEP_CATCH = -2
export const RUN_STEP_FINALLY = -3

type RunStep<T> = (this: IInternalState, top: Internal<Value<T>>, index: number) => CycleResult

export type RunSteps<T = any> = Array<RunStep<T>>

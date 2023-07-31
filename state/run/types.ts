import { InternalValue, CycleResult, State } from '../index'

export const RUN_STEP_END = -1
export const RUN_STEP_CATCH = -2
export const RUN_STEP_FINALLY = -3

export type RunSteps = Array<(this: State, top: InternalValue, index: number) => CycleResult>

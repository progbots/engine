import { InternalValue, State } from '../index'
import { EngineSignal } from '../../index'

export const RUN_STEP_END = -1
export const RUN_STEP_CATCH = -2
export const RUN_STEP_FINALLY = -3

export type RunStepResult = EngineSignal | InternalValue | undefined
export type RunSteps = Array<(this: State, top: InternalValue, index: number) => RunStepResult>

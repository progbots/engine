import { InternalValue, State } from '../index'
import { EngineSignal } from '../../index'

export type RunStepResult = EngineSignal | InternalValue | undefined
export type RunSteps = Array<(this: State) => RunStepResult>

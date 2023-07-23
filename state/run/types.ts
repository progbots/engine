import { InternalValue, State } from '../index'
import { EngineSignal } from '../../index'

export type RunHandlerReturn = EngineSignal | InternalValue | undefined
export type RunHandler = Array<(this: State) => RunHandlerReturn>

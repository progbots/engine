import { IDictionary } from './Value'
import { IState } from './IState'
import { State } from './state/index'

export interface StateFactorySettings {
  hostDictionary?: IDictionary
  maxMemoryBytes?: number
  keepDebugInfo?: boolean
  yieldDebugSignals?: boolean
}

export function createState (settings?: StateFactorySettings): IState {
  return new State(settings)
}

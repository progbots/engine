import { IDictionary } from './IDictionary'
import { IState } from './IState'
import { State } from '@state/State'

export interface StateFactorySettings {
  hostDictionary?: IDictionary
  maxMemoryBytes?: number
}

export function createState (settings?: StateFactorySettings): IState {
  return new State(settings)
}

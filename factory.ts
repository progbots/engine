import { IState, StateFactorySettings } from './index'
import { State } from './state/index'

export function createState (settings?: StateFactorySettings): IState {
  return new State(settings)
}

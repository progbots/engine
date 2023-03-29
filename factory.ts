import { IState, StateFactorySettings } from '.'
import { State } from './state'

export function createState (settings?: StateFactorySettings): IState {
  return new State(settings)
}

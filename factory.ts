import { IState } from '.'
import { State } from './state'

export function createState (): IState {
  return new State()
}

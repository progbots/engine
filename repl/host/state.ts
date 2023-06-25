import { State } from '../../state/index'
import { $state } from '../signals'

export function state (state: State): void {
  state.signal($state)
}

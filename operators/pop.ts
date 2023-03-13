import { IState } from '../types'
import { checkStack } from './check-state'

export function pop (state: IState): void {
  checkStack(state, null)
  state.pop()
}

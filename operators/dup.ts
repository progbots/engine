import { IState } from '../types'
import { checkStack } from './check-state'

export function dup (state: IState): void {
  checkStack(state, null)
  const [value] = state.stack()
  state.push(value)
}

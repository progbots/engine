import { checkStack } from '../state'
import { IState, ValueType } from '../types'

export function index (state: IState): void {
  const [pos] = checkStack(state, ValueType.number).map(value => value.data as number)
  state.pop()
  const value = state.index(pos)
  state.push(value)
}

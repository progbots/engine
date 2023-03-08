import { IState, ValueType } from '../types'
import { checkStack } from '../state'

export function sub (state: IState): void {
  const [first, second] = checkStack(state, ValueType.number, ValueType.number).map(value => value.data as number)
  state.pop()
  state.pop()
  state.push({
    type: ValueType.number,
    data: first - second
  })
}

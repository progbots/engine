import { IState, ValueType } from '../types'

export function mark (state: IState): void {
  state.push({
    type: ValueType.mark,
    data: null
  })
}

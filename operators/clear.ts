import { IState } from '../types'

export function clear (state: IState): void {
  const stack = state.stackRef()
  while (stack.length > 0) {
    state.pop()
  }
}

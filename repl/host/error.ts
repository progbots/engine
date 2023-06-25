import { State } from '../../state/index'

export function error (state: State): void {
  throw new Error('JS Error')
}

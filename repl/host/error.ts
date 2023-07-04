import { State } from '../../state/index'

export function error (state: State): undefined {
  throw new Error('JS Error')
}

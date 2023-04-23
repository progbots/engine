import { State } from '../../state/index'

export function * error (state: State): Generator {
  throw new Error('JS Error')
}

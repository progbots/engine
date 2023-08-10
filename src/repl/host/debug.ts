import { State } from '../../state/index'
import { $debug } from '../signals'

export function * debug (state: State): Generator {
  yield $debug
}

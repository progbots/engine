import { State } from '../../state/index'
import { compute } from './integer'

export function * add (state: State): Generator {
  compute(state, (value1: number, value2: number) => value1 + value2)
}

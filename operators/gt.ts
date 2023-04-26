import { State } from '../state/index'
import { compare } from './integer'

export function * gt (state: State): Generator {
  compare(state, (value1: number, value2: number) => value1 > value2)
}

import { State } from '../../state/index'
import { compare } from './integer'

export function lt (state: State): undefined {
  compare(state, (value1: number, value2: number) => value1 < value2)
}

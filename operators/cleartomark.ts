import { State } from '../state/index'
import { spliceOperands, findMarkPos } from './operands'

export function * cleartomark (state: State): Generator {
  spliceOperands(state, findMarkPos(state) + 1)
}

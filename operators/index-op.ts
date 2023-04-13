import { State } from '../state/index'
import { checkOperands } from './operands'
import { ValueType } from '../index'
import { RangeCheck, StackUnderflow } from '../errors/index'

export function * index (state: State): Generator {
  const [pos] = checkOperands(state, ValueType.integer).map(value => value.data as number)
  if (pos < 0) {
    throw new RangeCheck()
  }
  const stack = state.operandsRef
  if (pos + 1 >= stack.length) {
    throw new StackUnderflow()
  }
  state.pop()
  const value = stack[pos]
  state.push(value)
}

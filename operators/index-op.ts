import { State } from '../state'
import { checkOperands } from './operands'
import { ValueType } from '..'
import { RangeCheck, StackUnderflow } from '../errors'

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

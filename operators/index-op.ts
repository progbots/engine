import { State } from '../state'
import { checkStack } from './check-state'
import { ValueType } from '../types'
import { RangeCheck, StackUnderflow } from '../errors'

export function index (state: State): void {
  const [pos] = checkStack(state, ValueType.integer).map(value => value.data as number)
  if (pos < 0) {
    throw new RangeCheck()
  }
  const stack = state.stackRef()
  if (pos + 1 >= stack.length) {
    throw new StackUnderflow()
  }
  state.pop()
  const value = stack[pos]
  state.push(value)
}

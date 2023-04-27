import { State } from '../state/index'
import { checkOperands, spliceOperands } from './operands'
import { ValueType } from '../index'
import { RangeCheck, StackUnderflow } from '../errors/index'

export function * index (state: State): Generator {
  const [pos] = checkOperands(state, ValueType.integer).map(value => value.data as number)
  if (pos < 0) {
    throw new RangeCheck()
  }
  const stack = state.operandsRef
  const valuePos = pos + 1
  if (valuePos >= stack.length) {
    throw new StackUnderflow()
  }
  spliceOperands(state, 1, stack[valuePos])
}

import { ValueType } from '@api'
import { CycleResult, IInternalState } from '@sdk'
import { RangeCheck, StackUnderflow } from '@errors'

export function index ({ operands }: IInternalState): CycleResult {
  const [{ number: pos }] = operands.check(ValueType.integer)
  if (pos < 0) {
    throw new RangeCheck()
  }
  const valuePos = pos + 1
  if (valuePos >= operands.length) {
    throw new StackUnderflow()
  }
  operands.splice(1, operands.ref[valuePos])
  return null
}

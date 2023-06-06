import { State } from '../../state/index'
import { ValueType } from '../../index'
import { RangeCheck, StackUnderflow } from '../../errors/index'

export function * index ({ operands }: State): Generator {
  const [pos] = operands.check(ValueType.integer).map(value => value.data as number)
  if (pos < 0) {
    throw new RangeCheck()
  }
  const valuePos = pos + 1
  if (valuePos >= operands.length) {
    throw new StackUnderflow()
  }
  operands.splice(1, operands.ref[valuePos])
}

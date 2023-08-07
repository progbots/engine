import { ValueType } from '../../index'
import { State, checkIntegerValue } from '../../state/index'

/* eslint-disable no-labels */

function extract ({ operands }: State): number[] {
  return operands.check(ValueType.integer, ValueType.integer).map(value => {
    assert: checkIntegerValue(value)
    return value.data
  })
}

export function compare (state: State, implementation: (value1: number, value2: number) => boolean): void {
  const [value2, value1] = extract(state)
  state.operands.splice(2, {
    type: ValueType.boolean,
    data: implementation(value1, value2)
  })
}

export function compute (state: State, implementation: (value1: number, value2: number) => number): void {
  const [value2, value1] = extract(state)
  state.operands.splice(2, {
    type: ValueType.integer,
    data: implementation(value1, value2)
  })
}

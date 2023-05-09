import { ValueType } from '../index'
import { State } from '../state/index'

function extract ({ operands }: State): number[] {
  return operands.check(ValueType.integer, ValueType.integer).map(value => value.data as number)
}

export function compare (state: State, implementation: (value1: number, value2: number) => boolean): void {
  const [value2, value1] = extract(state)
  const result = implementation(value1, value2)
  state.operands.splice(2, {
    type: ValueType.boolean,
    data: result
  })
}

export function compute (state: State, implementation: (value1: number, value2: number) => number): void {
  const [value2, value1] = extract(state)
  const result = implementation(value1, value2)
  state.operands.splice(2, {
    type: ValueType.integer,
    data: result
  })
}

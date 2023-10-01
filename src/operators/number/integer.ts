import { ValueType } from '@api'
import { IInternalState } from '@sdk'

function extract ({ operands }: IInternalState): [number, number] {
  const [{ number: value2 }, { number: value1 }] = operands.check(ValueType.integer, ValueType.integer)
  return [value2, value1]
}

export function compare (state: IInternalState, implementation: (value1: number, value2: number) => boolean): void {
  const [value2, value1] = extract(state)
  state.operands.splice(2, {
    type: ValueType.boolean,
    isSet: implementation(value1, value2)
  })
}

export function compute (state: IInternalState, implementation: (value1: number, value2: number) => number): void {
  const [value2, value1] = extract(state)
  state.operands.splice(2, {
    type: ValueType.integer,
    number: implementation(value1, value2)
  })
}

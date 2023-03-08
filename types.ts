export enum ValueType {
  number,
  string,
  id,
  function
}

export interface Value {
  type: ValueType
  data: number | string
}

export interface IState {
  count: () => number
  pop: () => void // StackUnderflow
  push: (value: Value) => void
  index: (pos: number) => Value // StackUnderflow
}

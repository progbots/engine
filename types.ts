export enum ValueType {
  number,
  string,
  id,
  operator,
  block
}

export type OperatorFunction = (state: IState) => void

export interface Value {
  type: ValueType
  data: number | string | OperatorFunction | Value[]
}

export interface IContext {
  def: (name: string, value: Value) => void
  lookup: (name: string) => Value | null
}

export interface IState {
  count: () => number
  pop: () => void // StackUnderflow
  push: (value: Value) => void
  index: (pos: number) => Value // StackUnderflow

  contexts: () => IContext[]
  lookup: (name: string) => Value // Undefined
}

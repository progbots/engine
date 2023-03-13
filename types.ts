export enum ValueType {
  integer = 'integertype',
  string = 'stringtype',
  name = 'nametype',
  operator = 'operatortype',
  array = 'arraytype'
}

export type OperatorFunction = (state: IState) => void | Generator<void>

export interface Value {
  type: ValueType
  data: number | string | OperatorFunction | Value[]
}

export interface IContext {
  def: (name: string, value: Value) => void
  lookup: (name: string) => Value | null
}

export interface IState {
  stack: () => readonly Value[] // ref
  pop: () => void // StackUnderflow
  push: (value: Value) => void

  contexts: () => readonly IContext[]
  lookup: (name: string) => Value // Undefined

  eval: (value: Value | string) => Generator<void>
}

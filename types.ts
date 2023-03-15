export enum ValueType {
  integer = 'integertype',
  string = 'stringtype',
  name = 'nametype',
  operator = 'operatortype',
  array = 'arraytype',
  dict = 'dicttype'
}

export type OperatorFunction = (state: IState) => void | Generator<void>

export interface Value {
  type: ValueType
  data: number | string | OperatorFunction | Value[] | IDictionary
}

export interface IDictionary {
  def: (name: string, value: Value) => void
  lookup: (name: string) => Value | null
  keys: () => string[]
}

export interface StateMemory {
  used: number
  total: number
}

export interface IState {
  memory: () => StateMemory

  stack: () => Generator<Value>
  pop: () => number // throw StackUnderflow
  push: (value: Value) => number

  dictionaries: () => Generator<IDictionary>
  lookup: (name: string) => Value // throw Undefined

  eval: (value: Value | string) => Generator<void>
}

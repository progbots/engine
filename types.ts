export enum ValueType {
  integer = 'integertype',
  string = 'stringtype',
  name = 'nametype',
  call = 'calltype',
  operator = 'operatortype',
  array = 'arraytype',
  dict = 'dicttype'
}

export type OperatorFunction = (state: IState) => void | Generator<void>

export interface IDictionary {
  def: (name: string, value: Value) => void
  lookup: (name: string) => Value | null
  keys: () => string[]
}

export interface Value {
  type: ValueType
  data: number // integer
  | string // string, name, call
  | OperatorFunction // operator
  | Value[] // array
  | IDictionary // dict
}

export interface StateMemory {
  used: number
  total: number
}

export interface IState {
  memory: () => StateMemory

  stackRef: () => readonly Value[]
  pop: () => void // throw StackUnderflow
  push: (value: Value) => void

  dictionaries: () => Generator<IDictionary>
  lookup: (name: string) => Value // throw Undefined
  begin: (dictionary: IDictionary) => void
  end: () => void // throw dictstackunderflow

  eval: (value: Value | string) => Generator<void>
}

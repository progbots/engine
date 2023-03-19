export enum ValueType {
  integer = 'integertype',
  string = 'stringtype',
  name = 'nametype',
  call = 'calltype',
  operator = 'operatortype',
  mark = 'marktype',
  array = 'arraytype',
  dict = 'dicttype'
}

export interface IDictionary {
  keys: () => string[]
  lookup: (name: string) => Value | null
}

export interface IArray {
  length: () => number
  values: () => Generator<Value>
}

export interface Value {
  type: ValueType
  data: null // mark
  | number // integer
  | string // string, name, call
  | Function // operator
  | IArray // array
  | IDictionary // dict
}

export interface IState {
  usedMemory: () => number
  totalMemory: () => number

  stackRef: () => readonly Value[]
  dictionaries: () => Generator<IDictionary>

  eval: (value: string) => Generator<void>
}

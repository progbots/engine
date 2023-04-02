export enum ValueType {
  boolean = 'booleantype',
  integer = 'integertype',
  string = 'stringtype',
  name = 'nametype',
  call = 'calltype',
  operator = 'operatortype',
  mark = 'marktype',
  array = 'arraytype',
  dict = 'dicttype',
  proc = 'proctype'
}

export interface IOperator {
  name: string
}

export interface IArray {
  readonly length: number
  at: (index: number) => Value // RangeCheck
}

export interface IDictionary {
  readonly names: string[]
  lookup: (name: string) => Value | null
}

export interface Value {
  readonly type: ValueType
  readonly data: null // mark
  | boolean // boolean
  | number // integer
  | string // string, name, call
  | IOperator // operator
  | IArray // array, proc
  | IDictionary // dict
}

export interface IState {
  readonly usedMemory: number
  readonly totalMemory: number

  readonly operands: IArray
  readonly dictionaries: IArray

  parse: (value: string, sourceFile?: string) => Generator
}

export interface StateFactorySettings {
  hostDictionary?: IDictionary
  maxMemoryBytes?: number
  keepDebugInfo?: boolean
}

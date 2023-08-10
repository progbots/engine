export enum ValueType {
  boolean = 'booleantype',
  integer = 'integertype',
  string = 'stringtype',
  mark = 'marktype',
  block = 'blocktype',
  call = 'calltype',
  operator = 'operatortype',
  array = 'arraytype',
  dictionary = 'dictionarytype'
}

export interface BooleanValue {
  readonly type: ValueType.boolean
  readonly isSet: boolean
}

export interface IntegerValue {
  readonly type: ValueType.integer
  readonly number: number
}

export interface StringValue {
  readonly type: ValueType.string
  readonly string: string
}

export interface MarkValue {
  readonly type: ValueType.mark
}

export interface IArray {
  readonly length: number
  at: (index: number) => Value | null
}

export interface BlockValue {
  readonly type: ValueType.block
  readonly block: IArray
}

export interface CallValue {
  readonly type: ValueType.call
  readonly call: string
}

export interface IOperator {
  name: string
}

export interface OperatorValue {
  readonly type: ValueType.operator
  readonly operator: IOperator
}

export interface ArrayValue {
  readonly type: ValueType.array
  readonly array: IArray
}

export interface IDictionary {
  readonly names: string[]
  lookup: (name: string) => Value | null
}

export interface DictionaryValue {
  readonly type: ValueType.dictionary
  readonly dictionary: IDictionary
}

export type Value =
  BooleanValue |
  IntegerValue |
  StringValue |
  MarkValue |
  BlockValue |
  CallValue |
  OperatorValue |
  ArrayValue |
  DictionaryValue

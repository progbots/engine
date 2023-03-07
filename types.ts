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

export type Dictionary = Record<string, Value>

export interface State {
  contexts: Dictionary[]
  stack: Value[]
}

export enum ValueType {
  boolean = 'booleantype',
  integer = 'integertype',
  string = 'stringtype',
  call = 'calltype',
  operator = 'operatortype',
  mark = 'marktype',
  array = 'arraytype',
  dict = 'dicttype',
  block = 'blocktype',
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
  | string // string, call
  | IOperator // operator
  | IArray // array, proc
  | IDictionary // dict
}

export const EngineSignalPrefix = 'engine-signal:'

export enum EngineSignal {
  beforeParse = `${EngineSignalPrefix}before-parse`,
  tokenParsed = `${EngineSignalPrefix}token-parsed`,
  afterParse = `${EngineSignalPrefix}after-parse`,
  beforeCall = `${EngineSignalPrefix}before-call`,
  afterCall = `${EngineSignalPrefix}after-call`,
  beforeOperator = `${EngineSignalPrefix}before-operator`,
  afterOperator = `${EngineSignalPrefix}after-operator`,
  beforeProc = `${EngineSignalPrefix}before-proc`,
  beforeProcItem = `${EngineSignalPrefix}before-proc-item`,
  afterProcItem = `${EngineSignalPrefix}after-proc-item`,
  afterProc = `${EngineSignalPrefix}after-proc`,
  beforeOperand = `${EngineSignalPrefix}before-operand`,
  afterOperand = `${EngineSignalPrefix}after-operand`
}

export interface IState {
  readonly usedMemory: number
  readonly totalMemory: number

  readonly operands: IArray
  readonly dictionaries: IArray
  readonly calls: IArray

  readonly parsing: boolean
  parse: (value: string, sourceFile?: string) => Generator
}

export interface StateFactorySettings {
  hostDictionary?: IDictionary
  maxMemoryBytes?: number
  keepDebugInfo?: boolean
}

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

export type Value = {
  readonly type: ValueType.boolean
  readonly data: boolean
} | {
  readonly type: ValueType.integer
  readonly data: number
} | {
  readonly type: ValueType.string | ValueType.call
  readonly data: string
} | {
  readonly type: ValueType.operator
  readonly data: IOperator
} | {
  readonly type: ValueType.mark
  readonly data: null
} | {
  readonly type: ValueType.array | ValueType.block | ValueType.proc
  readonly data: IArray
} | {
  readonly type: ValueType.dict
  readonly data: IDictionary
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

export interface IStateFlags {
  readonly debug: boolean
  readonly parsing: boolean
  readonly call: boolean
}

export interface IState {
  readonly usedMemory: number
  readonly peakMemory: number
  readonly totalMemory: number

  readonly flags: IStateFlags

  readonly operands: IArray
  readonly dictionaries: IArray
  readonly calls: IArray

  parse: (value: string, sourceFile?: string) => Generator
}

export interface StateFactorySettings {
  hostDictionary?: IDictionary
  maxMemoryBytes?: number
  keepDebugInfo?: boolean
}

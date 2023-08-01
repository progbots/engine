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

export interface BooleanValue {
  readonly type: ValueType.boolean
  readonly data: boolean
}

export interface IntegerValue {
  readonly type: ValueType.integer
  readonly data: number
}

export interface StringValue {
  readonly type: ValueType.string
  readonly data: string
}

export interface CallValue {
  readonly type: ValueType.call
  readonly data: string
}

export interface OperatorValue {
  readonly type: ValueType.operator
  readonly data: IOperator
}

export interface MarkValue {
  readonly type: ValueType.mark
  readonly data: null
}

export interface ArrayValue {
  readonly type: ValueType.array
  readonly data: IArray
}

export interface BlockValue {
  readonly type: ValueType.block
  readonly data: IArray
}

export interface ProcValue {
  readonly type: ValueType.proc
  readonly data: IArray
}

export interface DictValue {
  readonly type: ValueType.dict
  readonly data: IDictionary
}

export type Value = BooleanValue | IntegerValue | StringValue | CallValue | OperatorValue | MarkValue | ArrayValue | BlockValue | ProcValue | DictValue

export const EngineSignalPrefix = 'engine-signal:'

export enum EngineSignalType {
  cycle = `${EngineSignalPrefix}cycle`,
  custom = `${EngineSignalPrefix}custom`,
  stop = `${EngineSignalPrefix}stop`,
  // debug only
  beforeParse = `${EngineSignalPrefix}before-parse`,
  tokenParsed = `${EngineSignalPrefix}token-parsed`,
  afterParse = `${EngineSignalPrefix}after-parse`,
  callStackChanged = `${EngineSignalPrefix}call-stack-changed`,
  beforeOperand = `${EngineSignalPrefix}before-operand`,
  afterOperand = `${EngineSignalPrefix}after-operand`,
  beforeCall = `${EngineSignalPrefix}before-call`,
  afterCall = `${EngineSignalPrefix}after-call`,
  beforeOperator = `${EngineSignalPrefix}before-operator`,
  afterOperator = `${EngineSignalPrefix}after-operator`,
  beforeBlock = `${EngineSignalPrefix}before-block`,
  beforeBlockItem = `${EngineSignalPrefix}before-block-item`,
  afterBlock = `${EngineSignalPrefix}after-block`,
}

export type EngineSignal = {
  type: EngineSignalType.cycle |
  EngineSignalType.stop
  debug: false
} | {
  type: EngineSignalType.custom
  debug: false
  name: string | Symbol
  parameters?: any
} | {
  type: EngineSignalType.beforeParse |
  EngineSignalType.afterParse
  debug: true
  source: string
  sourceFile?: string
} | {
  type: EngineSignalType.tokenParsed
  debug: true
  source: string
  sourceFile?: string
  sourcePos: number
  token: string
} | {
  type: EngineSignalType.callStackChanged
  debug: true
  delta: 'push' | 'pop'
} | {
  type: EngineSignalType.beforeCall |
  EngineSignalType.afterCall
  debug: true
  name: string
} | {
  type: EngineSignalType.beforeOperator |
  EngineSignalType.afterOperator
  debug: true
  name: string
} | {
  type: EngineSignalType.beforeBlock |
  EngineSignalType.afterBlock
  debug: true
  block: IArray
} | {
  type: EngineSignalType.beforeBlockItem
  debug: true
  block: IArray
  index: number
}

export interface IStateMemory {
  readonly used: number
  readonly peak: number
  readonly total: number
}

export interface IStateFlags {
  readonly keepDebugInfo: boolean
  readonly yieldDebugSignals: boolean
  readonly parsing: boolean
  readonly call: boolean
}

export interface IState {
  readonly memory: IStateMemory
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
  yieldDebugSignals?: boolean
}

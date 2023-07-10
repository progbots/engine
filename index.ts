import { InternalValue } from './state'

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

export enum EngineSignalType {
  cycle = `${EngineSignalPrefix}cycle`,
  beforeParse = `${EngineSignalPrefix}before-parse`,
  tokenParsed = `${EngineSignalPrefix}token-parsed`,
  afterParse = `${EngineSignalPrefix}after-parse`,
  beforeCall = `${EngineSignalPrefix}before-call`,
  afterCall = `${EngineSignalPrefix}after-call`,
  beforeOperator = `${EngineSignalPrefix}before-operator`,
  afterOperator = `${EngineSignalPrefix}after-operator`,
  beforeBlock = `${EngineSignalPrefix}before-block`,
  beforeBlockItem = `${EngineSignalPrefix}before-block-item`,
  afterBlock = `${EngineSignalPrefix}after-block`,
  callStackChanged = `${EngineSignalPrefix}call-stack-changed`
}

export type EngineSignal = {
  type: EngineSignalType.cycle
  debug: false
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
  type: EngineSignalType.beforeCall |
  EngineSignalType.afterCall
  debug: true
  call: InternalValue
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
} | {
  type: EngineSignalType.callStackChanged
  debug: true
}

export interface IStateMemory {
  readonly used: number
  readonly peak: number
  readonly total: number
}

export interface IStateFlags {
  readonly debug: boolean
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
}

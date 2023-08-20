import { IArray } from './Value'

const SignalPrefix = 'signal:'

export enum SignalType {
  cycle = `${SignalPrefix}cycle`,
  custom = `${SignalPrefix}custom`,
  stop = `${SignalPrefix}stop`,
  beforeParse = `${SignalPrefix}before-parse`,
  tokenParsed = `${SignalPrefix}token-parsed`,
  afterParse = `${SignalPrefix}after-parse`,
  callStackChanged = `${SignalPrefix}call-stack-changed`,
  beforeOperand = `${SignalPrefix}before-operand`,
  afterOperand = `${SignalPrefix}after-operand`,
  beforeCall = `${SignalPrefix}before-call`,
  afterCall = `${SignalPrefix}after-call`,
  beforeOperator = `${SignalPrefix}before-operator`,
  afterOperator = `${SignalPrefix}after-operator`,
  beforeBlock = `${SignalPrefix}before-block`,
  beforeBlockItem = `${SignalPrefix}before-block-item`,
  afterBlock = `${SignalPrefix}after-block`,
}

export type Signal = {
  type: SignalType.cycle | SignalType.stop
  debug: false
} | {
  type: SignalType.custom
  debug: false
  name: string | Symbol
} | {
  type: SignalType.beforeParse | SignalType.afterParse
  debug: true
  source: string
  sourceFile: string
} | {
  type: SignalType.tokenParsed
  debug: true
  source: string
  sourceFile: string
  sourcePos: number
  token: string
} | {
  type: SignalType.callStackChanged
  debug: true
  delta: 'push' | 'pop'
} | {
  type: SignalType.beforeCall | SignalType.afterCall
  debug: true
  name: string
} | {
  type: SignalType.beforeOperator | SignalType.afterOperator
  debug: true
  name: string
} | {
  type: SignalType.beforeBlock | SignalType.afterBlock
  debug: true
  block: IArray
} | {
  type: SignalType.beforeBlockItem
  debug: true
  block: IArray
  index: number
}

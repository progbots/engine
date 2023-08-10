import { IArray } from './Value'

export interface IStateMemory {
  readonly used: number
  readonly peak: number
  readonly total: number
}

export interface IStateFlags {
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

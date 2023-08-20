import { IStateFlags } from './IStateFlags'
import { IStateMemory } from './IStateMemory'
import { IArray } from './IArray'

export interface IState {
  readonly memory: IStateMemory
  readonly flags: IStateFlags
  readonly operands: IArray
  readonly dictionaries: IArray
  readonly calls: IArray
  parse: (value: string, sourceFile?: string) => Generator
}

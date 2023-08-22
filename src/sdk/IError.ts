import { IDictionary } from '../api/IDictionary'

export interface IError extends Error, IDictionary {
  readonly dictionary: IDictionary
  readonly callstack: string
  release: () => {}
}

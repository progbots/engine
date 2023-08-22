import { IDictionary } from '@api'

export interface IError extends Error, IDictionary {
  readonly dictionary: IDictionary
  readonly callstack: string
  release: () => {}
}

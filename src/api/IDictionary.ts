import { Value } from './Value'

export interface IDictionary {
  readonly names: string[]
  lookup: (name: string) => Value | null
}

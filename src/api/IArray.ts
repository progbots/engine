import { Value } from './Value'

export interface IArray {
  readonly length: number
  at: (index: number) => Value | null
}

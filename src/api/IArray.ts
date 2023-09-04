import { Value } from './Value'

export interface IArray {
  readonly length: number
  at: (index: number) => Value | null
}

export function * getIArrayValues (iArray: IArray): Generator<Value> {
  const { length } = iArray
  for (let index = 0; index < length; ++index) {
    const value = iArray.at(index)
    if (value !== null) {
      yield value
    }
  }
}

import { IArray, Value } from '..'
import { blue, white } from './colors'

export function forEach (array: IArray, callback: (value: Value, formattedIndex: string) => void): void {
  const { length } = array
  let width = 1
  if (length > 10) {
    ++width
  }
  if (length > 100) {
    ++width
  }
  for (let index = 0; index < length; ++index) {
    const formattedIndex = `${blue}${index.toString().padStart(width, ' ')}${white}`
    callback(array.at(index), formattedIndex)
  }
}

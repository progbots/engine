import { IArray, Value } from '@api'
import { CompatibleValue, toValue } from './toValue'

export function toIArray (values: CompatibleValue[]): IArray {
  return {
    get length () {
      return values.length
    },

    at (index): Value | null {
      const value = values[index]
      if (value === undefined) {
        return null
      }
      return toValue(value)
    }
  }
}

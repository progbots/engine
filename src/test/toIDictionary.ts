import { IDictionary, Value, ValueType } from '@api'
import { scanGenericValue, scanOperatorFunction } from '@sdk'

export type DictionaryMapping = Record<string, string | number | Function | Value>

export function toIDictionary (mapping: DictionaryMapping): IDictionary {
  return {
    get names () {
      return Object.keys(mapping)
    },

    lookup (name: string): Value | null {
      const value = mapping[name]
      if (value === undefined) {
        return null
      }
      if (typeof value === 'string') {
        return {
          type: ValueType.string,
          string: value
        }
      }
      if (typeof value === 'number') {
        // TODO: asserts on integer
        return {
          type: ValueType.integer,
          number: value
        }
      }
      if (typeof value === 'function') {
        scanOperatorFunction(value)
        return {
          type: ValueType.operator,
          operator: value
        }
      }
      scanGenericValue(value)
      return value
    }
  }
}

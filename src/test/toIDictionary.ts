import { IDictionary, Value } from '@api'
import { CompatibleValue, toValue } from './toValue'

export type DictionaryMapping = Record<string, CompatibleValue>

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
      return toValue(value)
    }
  }
}

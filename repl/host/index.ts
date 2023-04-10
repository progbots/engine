import { Value, ValueType } from '../..'
import { OperatorFunction } from '../../state'

import { colors } from './colors'
import { debug } from './debug'
import { exit } from './exit'
import { load } from './load'
import { state } from './state'

const hostMethods: Record<string, OperatorFunction> = {
  colors,
  debug,
  exit,
  load,
  state
}

export const hostDictionary = {
  get names () {
    return Object.keys(hostMethods)
  },

  lookup (name: string): Value | null {
    const operator = hostMethods[name]
    if (operator === undefined) {
      return null
    }
    return {
      type: ValueType.operator,
      data: operator
    }
  }
}

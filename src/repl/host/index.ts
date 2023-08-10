import { Value, ValueType } from '../../index'
import { OperatorFunction } from '../../state/index'

import { debug } from './debug'
import { exit } from './exit'
import { load } from './load'
import { state } from './state'
import { error } from './error'
import { print } from './print'

const hostMethods: Record<string, OperatorFunction> = {
  debug,
  exit,
  load,
  state,
  error,
  print
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

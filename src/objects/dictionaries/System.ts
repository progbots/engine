import { Value, ValueType, IDictionary } from '@api'
import { IOperatorFunction } from '@sdk'
import { ShareableObject } from '@objects/ShareableObject'
import * as operatorFunctions from '@operators'
import * as errorFunctions from '@operators/errors'
import { DICT_TYPE_INTERNAL_NAME, SYSTEM_TYPE } from './dict-type'

const operators: Record<string, IOperatorFunction> = {}

Object.values(operatorFunctions).forEach(operator => {
  operators[operator.name] = operator as IOperatorFunction // TODO remove
})
Object.values(errorFunctions.default).forEach(operator => {
  operators[operator.name] = operator
})

export class SystemDictionary extends ShareableObject implements IDictionary {
  // region IDictionary

  get names (): string [] {
    return Object.keys(operators)
  }

  lookup (name: string): Value | null {
    const operator = operators[name]
    if (operator === undefined) {
      if (name === DICT_TYPE_INTERNAL_NAME) {
        return {
          type: ValueType.string,
          string: SYSTEM_TYPE
        }
      }
      return null
    }
    return {
      type: ValueType.operator,
      operator
    }
  }

  // endregion IDictionary

  protected _dispose (): void {}
}

import { Value, ValueType, IDictionary } from '@api'
import { IOperatorFunction } from '@sdk'
import { ShareableObject } from '@objects/ShareableObject'
import * as operatorFunctions from '@operators'
import * as errorFunctions from '@operators/errors'

const operators: Record<string, IOperatorFunction> = {}

Object.values(operatorFunctions).forEach(operator => {
  operators[operator.name] = operator as IOperatorFunction // TODO: remove static cast
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

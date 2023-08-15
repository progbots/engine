import { Value, ValueType, IDictionary } from '../../index'
import { ShareableObject } from '../ShareableObject'
import { OperatorFunction } from '../../state/index'
import * as operatorFunctions from '../../operators/index'
import * as errorFunctions from '../../operators/errors'

const operators: Record<string, OperatorFunction> = {}

Object.values(operatorFunctions).forEach(operator => {
  operators[operator.name] = operator
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

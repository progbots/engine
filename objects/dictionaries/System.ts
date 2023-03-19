import { IDictionary, Value, ValueType } from '../..'
import { ShareableObject } from '../ShareableObject'
import { InvalidAccess } from '../../errors'
import { OperatorFunction } from '../../state'
import * as operatorFunctions from '../../operators'

const operators: Record<string, OperatorFunction> = {}

Object.values(operatorFunctions).forEach(operator => {
  operators[operator.name] = operator
})

export class SystemDictionary extends ShareableObject implements IDictionary {
  // region IDictionary

  get keys (): string [] {
    return Object.keys(operators)
  }

  lookup (name: string): Value | null {
    const operator = operators[name]
    if (operator === undefined) {
      return null
    }
    return {
      type: ValueType.operator,
      data: operator
    }
  }

  // endregion IDictionary

  def (name: string, value: Value): void {
    throw new InvalidAccess()
  }

  protected _dispose (): void {}
}

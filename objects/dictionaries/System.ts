import { Value, ValueType } from '../..'
import { ShareableObject } from '../ShareableObject'
import { InvalidAccess } from '../../errors'
import { OperatorFunction } from '../../state'
import * as operatorFunctions from '../../operators'
import * as errorFunctions from '../../operators/errors'
import { IWritableDictionary } from './types'

const operators: Record<string, OperatorFunction> = {}

Object.values(operatorFunctions).forEach(operator => {
  operators[operator.name] = operator
})
Object.values(errorFunctions.default).forEach(operator => {
  operators[operator.name] = operator
})

export class SystemDictionary extends ShareableObject implements IWritableDictionary {
  // region IWritableDictionary

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
      data: operator
    }
  }

  def (name: string, value: Value): void {
    throw new InvalidAccess()
  }

  // endregion IWritableDictionary

  protected _dispose (): void {}
}

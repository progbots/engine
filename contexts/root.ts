import { IContext, OperatorFunction, Value, ValueType } from '../types'
import { InvalidAccess } from '../errors'
import { add, index, sub } from '../operators'

const operators: Record<string, OperatorFunction> = {
  add,
  index,
  sub
}

export class RootContext implements IContext {
  def (name: string, value: Value): void {
    throw new InvalidAccess()
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
}

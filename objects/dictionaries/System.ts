import { IDictionary, OperatorFunction, Value, ValueType } from '../../types'
import { ShareableObject } from '../ShareableObject'
import { InvalidAccess } from '../../errors'
import * as operators from '../../operators'

export class SystemDictionary extends ShareableObject implements IDictionary {
  def (name: string, value: Value): void {
    throw new InvalidAccess()
  }

  lookup (name: string): Value | null {
    const operator = (operators as Record<string, OperatorFunction>)[name]
    if (operator === undefined) {
      return null
    }
    return {
      type: ValueType.operator,
      data: operator
    }
  }

  keys (): string [] {
    return Object.keys(operators)
  }

  protected _dispose (): void {}
}

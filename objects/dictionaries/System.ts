import { IDictionary, OperatorFunction, Value, ValueType } from '../../types'
import { ShareableObject } from '../ShareableObject'
import { InvalidAccess } from '../../errors'
import {
  add,
  clear,
  dup,
  index,
  pop,
  sub
} from '../../operators'

const operators: Record<string, OperatorFunction> = {
  add,
  clear,
  dup,
  index,
  pop,
  sub
}

export class SystemDictionary extends ShareableObject implements IDictionary {
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

  keys (): string [] {
    return Object.keys(operators)
  }

  protected _dispose (): void {}
}

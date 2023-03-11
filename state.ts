import { IContext, IState, OperatorFunction, Value, ValueType } from './types'
import { StackUnderflow, TypeCheck, Undefined } from './errors'
import { RootContext } from './contexts'

export function checkStack (state: IState, ...types: ValueType[]): Value[] {
  const stack = state.stack()
  if (types.length > stack.length) {
    throw new StackUnderflow()
  }
  return types.map((type: ValueType, pos: number): Value => {
    const value = stack[pos]
    if (value.type !== type) {
      throw new TypeCheck()
    }
    return value
  })
}

export class State implements IState {
  private readonly _contexts: IContext[] = [
    new RootContext()
  ]

  constructor (
    private readonly _stack: Value[] = []
  ) {}

  stack (): readonly Value[] {
    return this._stack
  }

  pop (): void {
    if (this._stack.length === 0) {
      throw new StackUnderflow()
    }
    this._stack.shift()
  }

  push (value: Value): void {
    this._stack.unshift(value)
  }

  contexts (): readonly IContext[] {
    return this._contexts
  }

  lookup (name: string): Value {
    for (const context of this._contexts) {
      const value = context.lookup(name)
      if (value !== null) {
        return value
      }
    }
    throw new Undefined()
  }

  eval (value: Value): void {
    if (value.type === ValueType.name) {
      const resolvedValue = this.lookup(value.data as string)
      if (resolvedValue.type === ValueType.operator) {
        const operator = resolvedValue.data as OperatorFunction
        operator(this)
      } else {
        this.push(resolvedValue)
      }
    } else {
      this.push(value)
    }
  }
}

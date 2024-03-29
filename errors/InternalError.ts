import { IDictionary, Value, ValueType } from '../index'

const TYPE_PROPERTY = 'type'
const NAME_PROPERTY = 'name'
const MESSAGE_PROPERTY = 'message'
const STACK_PROPERTY = 'stack'

const NAMES = [
  TYPE_PROPERTY,
  NAME_PROPERTY,
  MESSAGE_PROPERTY,
  STACK_PROPERTY
]

const CR = '\n'
const NO_STACK = ''

export class InternalError extends Error implements IDictionary {
  constructor (message: string) {
    super(message)
    this.name = this.constructor.name
  }

  get dictionary (): IDictionary {
    return this
  }

  release (): void {}

  private _callstack: string = ''

  get callstack (): string {
    if (this._callstack !== '') {
      return this._callstack
    }
    return this.stack?.split(CR).slice(1).join(CR) ?? NO_STACK
  }

  set callstack (value: string) {
    if (this._callstack === '') {
      this._callstack = value
    }
  }

  // region IDictionary

  get names (): string[] {
    return NAMES
  }

  lookup (name: string): Value | null {
    let data: string | undefined
    if (name === TYPE_PROPERTY) {
      data = 'system'
    } else if (name === NAME_PROPERTY) {
      data = this.name
    } else if (name === MESSAGE_PROPERTY) {
      data = this.message
    } else if (name === STACK_PROPERTY) {
      data = this.callstack
    }
    if (data !== undefined) {
      return {
        type: ValueType.string,
        data
      }
    }
    return null
  }

  // endregion IDictionary
}

import { IDictionary, Value, ValueType } from '@api'

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

export class BaseError extends Error implements IDictionary {
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
    let string: string | undefined
    if (name === TYPE_PROPERTY) {
      string = 'system'
    } else if (name === NAME_PROPERTY) {
      string = this.name
    } else if (name === MESSAGE_PROPERTY) {
      string = this.message
    } else if (name === STACK_PROPERTY) {
      string = this.callstack
    }
    if (string !== undefined) {
      return {
        type: ValueType.string,
        string
      }
    }
    return null
  }

  // endregion IDictionary
}

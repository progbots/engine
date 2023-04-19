import { Value, ValueType } from '../index'
import { IWritableDictionary } from '../objects/dictionaries/index'
import { InternalValue } from '../state/index'

let _InvalidAccess: new () => Error

export function setInvalidAccess (InvalidAccess: typeof _InvalidAccess): void {
  _InvalidAccess = InvalidAccess
}

export class BaseError extends Error implements IWritableDictionary {
  constructor (message: string) {
    super(message)
    this.name = this.constructor.name
  }

  private _callstack: string = ''

  get callstack (): string {
    if (this._callstack !== '') {
      return this._callstack
    }
    return this.stack?.split('\n').slice(1).join('\n') ?? ''
  }

  set callstack (value: string) {
    if (this._callstack === '') {
      this._callstack = value
    }
  }

  // region IWritableDictionary

  get names (): string[] {
    return ['type', 'name', 'message', 'stack']
  }

  lookup (name: string): Value | null {
    let data: string | undefined
    if (name === 'type') {
      data = 'system'
    } else if (name === 'name') {
      data = this.name
    } else if (name === 'message') {
      data = this.message
    } else if (name === 'stack') {
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

  def (name: string, value: InternalValue): void {
    throw new _InvalidAccess()
  }

  // endregion IWritableDictionary
}

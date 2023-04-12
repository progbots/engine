export class BaseError extends Error {
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
}

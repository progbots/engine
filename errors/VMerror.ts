import { BaseError } from './BaseError'

export class VMError extends BaseError {
  constructor () {
    super('virtual memory full')
  }
}

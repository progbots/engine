import { BaseError } from './BaseError'

const message = 'Virtual memory error'

export class VMError extends BaseError {
  constructor () {
    super(message)
  }
}

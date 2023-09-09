import { BaseError } from './BaseError'

const message = 'Object is read-only'

export class InvalidAccess extends BaseError {
  constructor () {
    super(message)
  }
}

import { BaseError } from './BaseError'

export class InvalidAccess extends BaseError {
  constructor () {
    super('access attribute violated (e.g. attempted to write a read-only object)')
  }
}

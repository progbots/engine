import { InternalError } from './InternalError'

export class InvalidAccess extends InternalError {
  constructor () {
    super('access attribute violated (e.g. attempted to write a read-only object)')
  }
}

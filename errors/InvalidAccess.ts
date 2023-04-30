import { InternalError } from './InternalError'

const message = 'Object is read-only'

export class InvalidAccess extends InternalError {
  constructor () {
    super(message)
  }
}

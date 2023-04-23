import { InternalError } from './InternalError'

export class VMError extends InternalError {
  constructor () {
    super('virtual memory full')
  }
}

import { InternalError } from './InternalError'

const message = 'Virtual memory error'

export class VMError extends InternalError {
  constructor () {
    super(message)
  }
}

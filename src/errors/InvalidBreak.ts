import { InternalError } from './InternalError'

const message = 'break has been invoked outside of a loop'

export class InvalidBreak extends InternalError {
  constructor () {
    super(message)
  }
}

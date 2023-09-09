import { BaseError } from './BaseError'

const message = 'break has been invoked outside of a loop'

export class InvalidBreak extends BaseError {
  constructor () {
    super(message)
  }
}

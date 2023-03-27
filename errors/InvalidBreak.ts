import { BaseError } from './BaseError'

export class InvalidBreak extends BaseError {
  constructor () {
    super('a break has been invoked for which there is no dynamically enclosing looping context')
  }
}

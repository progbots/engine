import { InternalError } from './InternalError'

export class InvalidBreak extends InternalError {
  constructor () {
    super('a break has been invoked for which there is no dynamically enclosing looping context')
  }
}

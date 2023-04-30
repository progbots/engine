import { InternalError } from './InternalError'

const message = 'Name is not defined in the dictionary stack'

export class Undefined extends InternalError {
  constructor () {
    super(message)
  }
}

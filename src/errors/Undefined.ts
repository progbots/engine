import { BaseError } from './BaseError'

const message = 'Name is not defined in the dictionary stack'

export class Undefined extends BaseError {
  constructor () {
    super(message)
  }
}

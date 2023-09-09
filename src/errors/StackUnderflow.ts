import { BaseError } from './BaseError'

const message = 'Not enough operands on the stack to perform the operation'

export class StackUnderflow extends BaseError {
  constructor () {
    super(message)
  }
}

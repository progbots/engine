import { InternalError } from './InternalError'

const message = 'Not enough operands on the stack to perform the operation'

export class StackUnderflow extends InternalError {
  constructor () {
    super(message)
  }
}

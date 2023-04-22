import { InternalError } from './InternalError'

export class StackUnderflow extends InternalError {
  constructor () {
    super('you tried to pop from an empty stack')
  }
}

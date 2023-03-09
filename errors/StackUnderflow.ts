import { BaseError } from './BaseError'

export class StackUnderflow extends BaseError {
  constructor () {
    super('you tried to pop from an empty stack')
  }
}

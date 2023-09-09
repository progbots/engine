import { BaseError } from './BaseError'

const MESSAGE = 'No custom dictionary left to unstack'

export class DictStackUnderflow extends BaseError {
  constructor () {
    super(MESSAGE)
  }
}

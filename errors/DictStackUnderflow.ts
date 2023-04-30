import { InternalError } from './InternalError'

const MESSAGE = 'No custom dictionary left to unstack'

export class DictStackUnderflow extends InternalError {
  constructor () {
    super(MESSAGE)
  }
}

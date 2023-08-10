import { InternalError } from './InternalError'

const MESSAGE = 'Loop break'

export class Break extends InternalError {
  constructor () {
    super(MESSAGE)
  }
}

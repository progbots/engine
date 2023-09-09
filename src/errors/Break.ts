import { BaseError } from './BaseError'

const MESSAGE = 'Loop break'

export class Break extends BaseError {
  constructor () {
    super(MESSAGE)
  }
}

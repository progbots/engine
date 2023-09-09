import { BaseError } from './BaseError'

const MESSAGE = 'Engine is already busy parsing'

export class BusyParsing extends BaseError {
  constructor () {
    super(MESSAGE)
  }
}

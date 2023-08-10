import { InternalError } from './InternalError'

const MESSAGE = 'Engine is already busy parsing'

export class BusyParsing extends InternalError {
  constructor () {
    super(MESSAGE)
  }
}

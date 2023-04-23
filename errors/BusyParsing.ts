import { InternalError } from './InternalError'

export class BusyParsing extends InternalError {
  constructor () {
    super('The engine is already parsing a source')
  }
}

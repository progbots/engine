import { BaseError } from './BaseError'

export class BusyParsing extends BaseError {
  constructor () {
    super('The engine is already parsing a source')
  }
}

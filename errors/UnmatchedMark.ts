import { BaseError } from './BaseError'

export class UnmatchedMark extends BaseError {
  constructor () {
    super('mark object was not found in the stack')
  }
}

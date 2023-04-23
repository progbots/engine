import { InternalError } from './InternalError'

export class UnmatchedMark extends InternalError {
  constructor () {
    super('mark object was not found in the stack')
  }
}

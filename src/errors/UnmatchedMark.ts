import { InternalError } from './InternalError'

const message = 'Unmatched mark in the operand stack'

export class UnmatchedMark extends InternalError {
  constructor () {
    super(message)
  }
}

import { BaseError } from './BaseError'

const message = 'Unmatched mark in the operand stack'

export class UnmatchedMark extends BaseError {
  constructor () {
    super(message)
  }
}

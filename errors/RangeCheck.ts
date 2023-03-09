import { BaseError } from './BaseError'

export class RangeCheck extends BaseError {
  constructor () {
    super('operand is too big or too small')
  }
}

import { BaseError } from './BaseError'

const message = 'Operand is too big or too small'

export class RangeCheck extends BaseError {
  constructor () {
    super(message)
  }
}

import { InternalError } from './InternalError'

export class RangeCheck extends InternalError {
  constructor () {
    super('operand is too big or too small')
  }
}

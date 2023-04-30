import { InternalError } from './InternalError'

const message = 'Operand is too big or too small'

export class RangeCheck extends InternalError {
  constructor () {
    super(message)
  }
}

import { InternalError } from './InternalError'

const message = 'Operand is of the wrong type'

export class TypeCheck extends InternalError {
  constructor () {
    super(message)
  }
}

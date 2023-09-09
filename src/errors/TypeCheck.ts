import { BaseError } from './BaseError'

const message = 'Operand is of the wrong type'

export class TypeCheck extends BaseError {
  constructor () {
    super(message)
  }
}

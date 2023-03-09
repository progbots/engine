import { BaseError } from './BaseError'

export class TypeCheck extends BaseError {
  constructor () {
    super('operand is of the wrong type')
  }
}

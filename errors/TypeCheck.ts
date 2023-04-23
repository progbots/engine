import { InternalError } from './InternalError'

export class TypeCheck extends InternalError {
  constructor () {
    super('operand is of the wrong type')
  }
}

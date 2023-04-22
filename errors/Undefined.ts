import { InternalError } from './InternalError'

export class Undefined extends InternalError {
  constructor () {
    super('name is not defined in any dictionary on the stack')
  }
}

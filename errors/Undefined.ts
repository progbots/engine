import { BaseError } from './BaseError'

export class Undefined extends BaseError {
  constructor () {
    super('name is not defined in any dictionary on the stack')
  }
}

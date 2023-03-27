import { BaseError } from './BaseError'

export class Break extends BaseError {
  constructor () {
    super('break')
  }
}

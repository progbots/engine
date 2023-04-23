import { InternalError } from './InternalError'

export class Break extends InternalError {
  constructor () {
    super('break')
  }
}

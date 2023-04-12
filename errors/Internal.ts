import { BaseError } from './BaseError'

export class Internal extends BaseError {
  // For internal error, we ignore state stack
  // eslint-disable-next-line accessor-pairs
  set callstack (value: string) {}
}

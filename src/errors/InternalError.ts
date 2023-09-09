import { BaseError } from './BaseError'

export class InternalError extends BaseError {
  // For internal error, we ignore state stack
  // eslint-disable-next-line accessor-pairs
  override set callstack (value: string) {}
}

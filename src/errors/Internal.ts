import { InternalError } from './InternalError'

export class Internal extends InternalError {
  // For internal error, we ignore state stack
  // eslint-disable-next-line accessor-pairs
  override set callstack (value: string) {}
}

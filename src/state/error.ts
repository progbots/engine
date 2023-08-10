import { InternalError } from '../src/errors/InternalError'
import { Break, InvalidBreak } from '../src/errors/index'

export function wrapError (error: Error): void {
  if (error !== undefined) {
    // No internal error should go out because memory cannot be controlled (and they are not documented)
    if (error instanceof Break) {
      const invalidBreak = new InvalidBreak()
      invalidBreak.callstack = error.callstack
      error = invalidBreak
    }
    // No internal error should go out because memory cannot be controlled (and they are not documented)
    if (error instanceof InternalError) {
      const ex = new Error(error.message)
      ex.name = error.name
      ex.stack = error.callstack
      error.release()
      throw ex
    }
    throw error
  }
}

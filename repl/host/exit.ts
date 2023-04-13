import { State } from '../../state/index'

export class ExitError extends Error {}

export function * exit (state: State): Generator {
  throw new ExitError()
}

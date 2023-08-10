import { State } from '../../state/index'

export class ExitError extends Error {}

export function exit (state: State): undefined {
  throw new ExitError()
}

import { State } from '../../state/index'

export function * end ({ dictionaries }: State): Generator {
  dictionaries.end()
}

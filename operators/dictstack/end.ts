import { State } from '../../state/index'

export function end ({ dictionaries }: State): undefined {
  dictionaries.end()
}

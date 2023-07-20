import { State } from '../../state/index'

export function end ({ dictionaries }: State): void {
  dictionaries.end()
}

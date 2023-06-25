import { State } from '../../state/index'

export function currentdict ({ operands, dictionaries }: State): void {
  operands.push(dictionaries.at(0))
}

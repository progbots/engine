import { State } from '../../state/index'

export function currentdict ({ operands, dictionaries }: State): undefined {
  operands.push(dictionaries.at(0))
}

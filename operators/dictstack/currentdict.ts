import { State } from '../../state/index'

export function * currentdict ({ operands, dictionaries }: State): Generator {
  operands.push(dictionaries.at(0))
}

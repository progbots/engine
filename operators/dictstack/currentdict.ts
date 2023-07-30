import { AtomicResult, State } from '../../state/index'

export function currentdict ({ operands, dictionaries }: State): AtomicResult {
  operands.push(dictionaries.at(0))
  return null
}

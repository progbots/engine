import { CycleResult, State } from '../../state/index'

export function currentdict ({ operands, dictionaries }: State): CycleResult {
  operands.push(dictionaries.at(0))
  return null
}

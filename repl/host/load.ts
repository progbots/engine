import { ValueType } from '../..'
import { checkOperands } from '../../operators/operands'
import { State } from '../../state'
import { readFileSync } from 'node:fs'

export function * load (state: State): Generator {
  const [path] = checkOperands(state, ValueType.string).map(value => value.data as string)
  state.pop()
  const source = readFileSync(path).toString()
  yield * state.innerParse(source, path)
}

import { ValueType } from '..'
import { ArrayLike } from '../objects/Array'
import { State } from '../state'
import { checkOperands } from './operands'

export function * bind (state: State): Generator {
  const [proc] = checkOperands(state, ValueType.proc)
  const procArray = proc.data as unknown as ArrayLike
  for (let index = 0; index < procArray.ref.length; ++index) {
    const value = procArray.at(index)
    if (value.type === ValueType.call) {
      yield // bind cycle
      const resolvedValue = state.lookup(value.data as string)
      // TODO: how to deal with debug info ?
      // TODO: some operators can be replaced with values (true, false, mark...)
      procArray.set(index, resolvedValue)
    }
  }
}

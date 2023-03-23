import { ValueType } from '..'
import { ArrayLike } from '../objects/Array'
import { State } from '../state'
import { checkStack } from './check-state'

export function * bind (state: State): Generator {
  const [proc] = checkStack(state, ValueType.proc)
  const procArray = proc.data as unknown as ArrayLike
  for (let index = 0; index < procArray.ref.length; ++index) {
    const value = procArray.at(index)
    if (value.type === ValueType.call) {
      yield // bind cycle
      const resolvedValue = state.lookup(value.data as string)
      procArray.set(index, resolvedValue)
    }
  }
}

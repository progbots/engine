import { State } from '../state'
import { UnmatchedMark } from '../errors'
import { Array } from '../objects/Array'
import { Value, ValueType } from '..'

export function * closeArray (state: State): Generator {
  const pos = state.stackRef.findIndex((value: Value) => value.type === ValueType.mark)
  if (pos === -1) {
    throw new UnmatchedMark()
  }
  // const array = new Array()

  // state.push(array)
}

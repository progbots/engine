import { ValueType } from '..'
import { State } from '../state'
import { Dictionary } from '../objects/dictionaries'

export function * dict (state: State): Generator {
  const dict = new Dictionary(state.memoryTracker)
  state.push({
    type: ValueType.dict,
    data: dict
  })
  dict.release()
}

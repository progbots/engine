import { ValueType } from '../index'
import { State } from '../state/index'
import { Dictionary } from '../objects/dictionaries/index'

export function * dict (state: State): Generator {
  const dict = new Dictionary(state.memoryTracker)
  state.push({
    type: ValueType.dict,
    data: dict
  })
  dict.release()
}

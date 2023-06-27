import { ValueType } from '../../index'
import { State } from '../../state/index'
import { Dictionary } from '../../objects/dictionaries/index'

export function dict (state: State): undefined {
  const dict = new Dictionary(state.memoryTracker)
  state.operands.push({
    type: ValueType.dict,
    data: dict
  })
  dict.release()
}

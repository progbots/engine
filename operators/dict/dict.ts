import { ValueType } from '../../index'
import { CycleResult, State } from '../../state/index'
import { Dictionary } from '../../objects/dictionaries/index'

export function dict (state: State): CycleResult {
  const dict = new Dictionary(state.memoryTracker)
  state.operands.push({
    type: ValueType.dict,
    data: dict
  })
  dict.release()
  return null
}

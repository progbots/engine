import { ValueType } from '@api'
import { CycleResult, IInternalState } from '@sdk'
import { Dictionary } from '@dictionaries'

export function dict (state: IInternalState): CycleResult {
  const dictionary = new Dictionary(state.memoryTracker)
  state.operands.push({
    type: ValueType.dictionary,
    dictionary
  })
  dictionary.release()
  return null
}

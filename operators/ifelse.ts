import { State } from '../state'
import { ValueType } from '..'
import { checkStack } from './check-state'
import { ShareableObject } from '../objects/ShareableObject'

export function * ifelse (state: State): Generator {
  checkStack(state, ValueType.proc, ValueType.proc, ValueType.boolean)
  const [procElse, procIf, condition] = state.stackRef
  const shareableIf: ShareableObject = procIf.data as unknown as ShareableObject
  const shareableElse: ShareableObject = procElse.data as unknown as ShareableObject
  shareableIf.addRef()
  shareableElse.addRef()
  state.pop()
  state.pop()
  state.pop()
  try {
    if (condition.data as boolean) {
      yield * state.eval(procIf)
    } else {
      yield * state.eval(procElse)
    }
  } finally {
    shareableIf.release()
    shareableElse.release()
  }
}

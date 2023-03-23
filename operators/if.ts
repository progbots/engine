import { State } from '../state'
import { ValueType } from '..'
import { checkStack } from './check-state'
import { ShareableObject } from '../objects/ShareableObject'

export function * ifOp (state: State): Generator {
  checkStack(state, ValueType.proc, ValueType.boolean)
  const [proc, condition] = state.stackRef
  const shareable: ShareableObject = proc.data as unknown as ShareableObject
  shareable.addRef()
  state.pop()
  state.pop()
  try {
    if (condition.data as boolean) {
      yield * state.eval(proc)
    }
  } finally {
    shareable.release()
  }
}

Object.defineProperty(ifOp, 'name', {
  value: 'if',
  writable: false
})

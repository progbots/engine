import { ValueType } from '..'
import { Break } from '../errors'
import { ShareableObject } from '../objects/ShareableObject'
import { State } from '../state'
import { checkStack } from './check-state'

export function * loop (state: State): Generator {
  const [proc] = checkStack(state, ValueType.proc)
  ShareableObject.addRef(proc)
  try {
    state.pop()
    while (true) {
      yield * state.eval(proc)
    }
  } catch (e) {
    if (!(e instanceof Break)) {
      throw e
    }
  } finally {
    ShareableObject.release(proc)
  }
}

import { ValueType } from '../index'
import { Break } from '../errors/index'
import { ShareableObject } from '../objects/ShareableObject'
import { State } from '../state/index'
import { checkOperands } from './operands'

export function * loop (state: State): Generator {
  const [proc] = checkOperands(state, ValueType.proc)
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

Object.defineProperty(loop, 'breakable', {
  value: true,
  writable: false
})

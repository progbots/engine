import { ValueType } from '../index'
import { Break } from '../errors/index'
import { ShareableObject } from '../objects/ShareableObject'
import { State } from '../state/index'

export function * loop (state: State): Generator {
  const { operands } = state
  const [proc] = operands.check(ValueType.proc)
  ShareableObject.addRef(proc)
  try {
    operands.pop()
    // Stryker disable next-line all: will obviously lead to a timeout
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

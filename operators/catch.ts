import { State } from '../state/index'
import { ValueType } from '../index'
import { ShareableObject } from '../objects/ShareableObject'
import { InternalError } from '../errors/InternalError'

export function * catchOp (state: State): Generator {
  const { operands } = state
  const [procCatch, proc] = operands.check(ValueType.proc, ValueType.proc)
  ShareableObject.addRef([proc, procCatch])
  try {
    operands.splice(2)
    yield * state.eval(proc)
  } catch (e) {
    if (e instanceof InternalError) {
      operands.push({
        type: ValueType.dict,
        data: e.dictionary
      })
      e.release()
      yield * state.eval(procCatch)
    } else {
      // Any other error is incompatible with the engine
      throw e
    }
  } finally {
    ShareableObject.release([proc, procCatch])
  }
}

Object.defineProperty(catchOp, 'name', {
  value: 'catch',
  writable: false
})

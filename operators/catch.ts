import { State } from '../state/index'
import { IDictionary, ValueType } from '../index'
import { checkOperands } from './operands'
import { ShareableObject } from '../objects/ShareableObject'
import { BaseError } from '../errors/BaseError'

export function * catchOp (state: State): Generator {
  const [procCatch, proc] = checkOperands(state, ValueType.proc, ValueType.proc)
  ShareableObject.addRef([proc, procCatch])
  try {
    state.pop()
    state.pop()
    yield * state.eval(proc)
  } catch (e) {
    if (e instanceof BaseError) {
      state.push({
        type: ValueType.dict,
        data: e.dictionary
      })
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

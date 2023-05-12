import { State } from '../state/index'
import { ValueType } from '../index'
import { ShareableObject } from '../objects/ShareableObject'

export function * finallyOp (state: State): Generator {
  const { operands } = state
  const [procFinally, proc] = operands.check(ValueType.proc, ValueType.proc)
  ShareableObject.addRef([proc, procFinally])
  let released = false
  const release = (): void => {
    if (!released) {
      ShareableObject.release([proc, procFinally])
      released = true
    }
  }
  try {
    operands.splice(2)
    yield * state.eval(proc)
  } finally {
    try {
      yield * state.eval(procFinally)
    } finally {
      release()
    }
    release()
  }
}

Object.defineProperty(finallyOp, 'name', {
  value: 'finally',
  writable: false
})

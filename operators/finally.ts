import { State } from '../state/index'
import { ValueType } from '../index'
import { ShareableObject } from '../objects/ShareableObject'

export function * finallyOp (state: State): Generator {
  const { operands } = state
  const [blockFinally, block] = operands.check(ValueType.block, ValueType.block)
  ShareableObject.addRef([block, blockFinally])
  let released = false
  const release = (): void => {
    if (!released) {
      ShareableObject.release([block, blockFinally])
      released = true
    }
  }
  try {
    operands.splice(2)
    yield * state.evalBlockOrProc(block)
  } finally {
    try {
      yield * state.evalBlockOrProc(blockFinally)
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

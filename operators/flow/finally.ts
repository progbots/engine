import { State } from '../../state/index'
import { ValueType } from '../../index'
import { ShareableObject } from '../../objects/ShareableObject'

export function * finallyOp (state: State): Generator {
  const { operands } = state
  const [blockFinally, block] = operands.check(ValueType.block, ValueType.block)
  ShareableObject.addRef([block, blockFinally])
  try {
    operands.splice(2)
    yield * state.stackForRunning({
      ...block,
      finally: function * (): Generator {
        try {
          yield * state.stackForRunning(blockFinally)
        } finally {
          ShareableObject.release(blockFinally)
        }
      }
    })
    ShareableObject.addRef(blockFinally)
  } finally {
    ShareableObject.release([block, blockFinally])
  }
}

Object.defineProperty(finallyOp, 'name', {
  value: 'finally',
  writable: false
})

import { State } from '../../state/index'
import { ValueType } from '../../index'
import { ShareableObject } from '../../objects/ShareableObject'

export function finallyOp (state: State): undefined {
  const { operands } = state
  const [blockFinally, block] = operands.check(ValueType.block, ValueType.block)
  ShareableObject.addRef([block, blockFinally])
  try {
    operands.splice(2)
    state.callstack.push({
      ...block,
      finally: () => {
        try {
          state.callstack.push(blockFinally)
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

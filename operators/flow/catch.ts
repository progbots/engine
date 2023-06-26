import { State } from '../../state/index'
import { ValueType } from '../../index'
import { ShareableObject } from '../../objects/ShareableObject'
import { InternalError } from '../../errors/InternalError'

export function catchOp (state: State): void {
  const { operands } = state
  const [blockCatch, block] = operands.check(ValueType.block, ValueType.block)
  ShareableObject.addRef([block, blockCatch])
  try {
    operands.splice(2)
    state.queue({
      block,
      catch: (e: InternalError) => {
        operands.push({
          type: ValueType.dict,
          data: e.dictionary
        })
        e.release()
        state.queue(blockCatch)
      },
      finally: () => {
        ShareableObject.release(blockCatch)
      }
    })
    ShareableObject.addRef(blockCatch)
  } finally {
    ShareableObject.release([block, blockCatch])
  }
}

Object.defineProperty(catchOp, 'name', {
  value: 'catch',
  writable: false
})

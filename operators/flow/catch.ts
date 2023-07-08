import { State } from '../../state/index'
import { ValueType } from '../../index'
import { ShareableObject } from '../../objects/ShareableObject'
import { InternalError } from '../../errors/InternalError'

export function * catchOp (state: State): Generator {
  const { operands } = state
  const [blockCatch, block] = operands.check(ValueType.block, ValueType.block)
  ShareableObject.addRef([block, blockCatch])
  try {
    operands.splice(2)
    yield * state.stackForRunning({
      ...block,
      catch: function (e: InternalError): Generator {
        operands.push({
          type: ValueType.dict,
          data: e.dictionary
        })
        e.release()
        return state.stackForRunning(blockCatch)
      },
      finally: (): undefined => {
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

import { ValueType } from '../../index'
import { Break } from '../../errors/index'
import { ShareableObject } from '../../objects/ShareableObject'
import { State } from '../../state/index'
import { InternalError } from '../../errors/InternalError'

export function * loop (state: State): Generator {
  const { operands } = state
  const [block] = operands.check(ValueType.block)
  ShareableObject.addRef(block)
  try {
    operands.pop()
    let continueLoop = true
    while (continueLoop) {
      yield // before loop
      state.callstack.push({
        ...block,
        catch: (e: InternalError) => {
          if (!(e instanceof Break)) {
            throw e
          }
          continueLoop = false
        }
      })
    }
  } finally {
    ShareableObject.release(block)
  }
}

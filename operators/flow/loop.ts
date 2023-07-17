import { ValueType } from '../../index'
import { Break } from '../../errors/index'
import { State, InternalValue } from '../../state/index'
import { InternalError } from '../../errors/InternalError'
import { setOperatorAttributes } from '../attributes'

export function * loop (state: State, [block]: InternalValue[]): Generator {
  state.operands.pop()
  while (true) {
    yield * state.stackForRunning(block)
  }
}

setOperatorAttributes(loop, {
  typeCheck: [ValueType.block],
  catch (state: State, parameters: InternalValue[], e: InternalError): undefined {
    if (!(e instanceof Break)) {
      throw e
    }
  }
})

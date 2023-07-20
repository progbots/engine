import { ValueType } from '../../index'
import { Break } from '../../errors/index'
import { State, InternalValue } from '../../state/index'
import { InternalError } from '../../errors/InternalError'
import { setOperatorAttributes } from '../attributes'

export function loop (state: State, [block]: InternalValue[]): void {
  state.operands.pop()
}

setOperatorAttributes(loop, {
  typeCheck: [ValueType.block],
  loop (state: State, [block]: InternalValue[]): boolean {
    state.stackForRunning(block)
    return true
  },
  catch (state: State, parameters: InternalValue[], e: InternalError): void {
    if (!(e instanceof Break)) {
      throw e
    }
  }
})

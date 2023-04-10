import { ValueType } from '../..'
import { ShareableObject } from '../../objects/ShareableObject'
import { checkOperands } from '../../operators/operands'
import { State } from '../../state'
import { cyan, yellow } from '../colors'
import { readChar } from '../readChar'
import { status } from '../status'
import { renderCallStack } from '../callstack'

export function * debug (state: State): Generator {
  const [proc] = checkOperands(state, ValueType.proc)
  ShareableObject.addRef(proc)
  try {
    state.pop()
    let lastOperandsCount = state.operands.length
    let lastUsedMemory = state.usedMemory
    const iterator = state.eval(proc)
    let stop = true
    let { done } = iterator.next()
    while (done === false) {
      yield // count cycle
      if (stop) {
        renderCallStack(state)

        status(state, {
          absolute: true,
          lastOperandsCount,
          lastUsedMemory,
          concat: `${cyan}, ${yellow}c${cyan}ontinue, ${yellow}q${cyan}uit`
        })

        lastOperandsCount = state.operands.length
        lastUsedMemory = state.usedMemory

        const step = readChar()
        if (step === 'q') {
          stop = false
        }
      }
      done = iterator.next().done
    }
  } finally {
    ShareableObject.release(proc)
  }
}

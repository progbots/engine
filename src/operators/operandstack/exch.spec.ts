import { StackUnderflow } from '../../src/errors/index'
import { executeTests } from '../../src/test-helpers'

describe('operators/operandstack/exch', () => {
  executeTests({
    'swaps top items of the stack': {
      src: '1 2 exch',
      expect: '2 1'
    },
    'manages reference counts': {
      src: '[1] [2] exch aload exch aload',
      expect: '1 2'
    },
    'fails with StackUnderflow on empty stack': {
      src: 'exch',
      error: StackUnderflow
    },
    'fails with StackUnderflow if only one item in the stack': {
      src: '1 exch',
      error: StackUnderflow
    }
  })
})

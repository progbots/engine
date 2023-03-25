import { StackUnderflow } from '../errors'
import { executeTests } from '../test-helpers'

describe('operators/exch', () => {
  executeTests({
    'swap top items of the stack': {
      src: '1 2 exch',
      expect: '2 1'
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

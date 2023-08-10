import { StackUnderflow } from '../../src/errors/index'
import { executeTests } from '../../src/test-helpers'

describe('operators/operandstack/dup', () => {
  executeTests({
    'duplicates top item of the stack': {
      src: '1 dup',
      expect: '1 1'
    },
    'fails with StackUnderflow on empty stack': {
      src: 'dup',
      error: StackUnderflow
    }
  })
})

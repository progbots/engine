import { StackUnderflow } from '../../src/errors/index'
import { executeTests } from '../../src/test-helpers'

describe('operators/operandstack/pop', () => {
  executeTests({
    'removes top item of the stack': {
      src: '1 2 pop',
      expect: '1'
    },
    'fails with StackUnderflow on empty stack': {
      src: 'pop',
      error: StackUnderflow
    }
  })
})

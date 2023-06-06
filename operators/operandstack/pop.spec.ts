import { StackUnderflow } from '../../errors/index'
import { executeTests } from '../../test-helpers'

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

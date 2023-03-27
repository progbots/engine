import { StackUnderflow } from '../errors'
import { executeTests } from '../test-helpers'

describe('operators/dup', () => {
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

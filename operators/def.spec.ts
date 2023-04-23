import { StackUnderflow, TypeCheck } from '../errors/index'
import { executeTests } from '../test-helpers'

describe('operators/def', () => {
  executeTests({
    'sets a value on the top dictionary': {
      src: 'dict begin "test" 42 def test end',
      expect: '42'
    },
    'fails with StackUnderflow on empty stack': {
      src: 'def',
      error: StackUnderflow
    },
    'fails with StackUnderflow on a single stack item': {
      src: '1 def',
      error: StackUnderflow
    },
    'fails with TypeCheck if no name is provided': {
      src: '0 1 def',
      error: TypeCheck
    }
  })
})

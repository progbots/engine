import { StackUnderflow, TypeCheck } from '../../src/errors/index'
import { executeTests } from '../../src/test-helpers'

describe('operators/dictstack/where', () => {
  executeTests({
    'returns the dictionary and true when found': {
      src: 'mark "add" where',
      expect: 'mark systemdict true'
    },
    'returns false when if not found': {
      src: 'mark "add-" where',
      expect: 'mark false'
    },
    'fails with StackUnderflow on empty stack': {
      src: 'where',
      error: StackUnderflow
    },
    'fails with TypeCheck if the parameter is not a string': {
      src: '0 where',
      error: TypeCheck
    }
  })
})

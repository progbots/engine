import { StackUnderflow, TypeCheck } from '../errors/index'
import { executeTests } from '../test-helpers'

describe('operators/apush', () => {
  executeTests({
    'pushes the element in the array': {
      src: '[1 2 3] dup 4 apush aload',
      expect: '1 2 3 4'
    },
    'fails with StackUnderflow on insufficient stack': [{
      src: 'apush',
      error: StackUnderflow
    }, {
      src: '4 apush',
      error: StackUnderflow
    }],
    'fails with TypeCheck if array is missing': {
      src: '1 2 apush',
      error: TypeCheck
    }
  })
})

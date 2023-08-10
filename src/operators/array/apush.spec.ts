import { StackUnderflow, TypeCheck } from '../../src/errors/index'
import { executeTests } from '../../src/test-helpers'

describe('operators/array/apush', () => {
  executeTests({
    'pushes the element in the array': {
      src: 'mark [1 2 3] dup 4 apush aload',
      expect: 'mark 1 2 3 4'
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

import { StackUnderflow, TypeCheck } from '../../errors/index'
import { executeTests } from '../../test-helpers'

describe('operators/number/sub', () => {
  executeTests({
    'substracts two numbers': {
      src: '2 3 sub',
      expect: '-1'
    },
    'fails with StackUnderflow on empty stack': {
      src: 'sub',
      error: StackUnderflow
    },
    'fails with StackUnderflow on a single stack item': {
      src: '1 sub',
      error: StackUnderflow
    },
    'fails with TypeCheck when no numbers are used': {
      src: '"a" "b" sub',
      error: TypeCheck
    },
    'fails with TypeCheck when mixed parameters are used': [{
      src: '"a" 2 sub',
      error: TypeCheck
    }, {
      src: '1 "b" sub',
      error: TypeCheck
    }]
  })
})

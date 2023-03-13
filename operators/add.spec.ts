import { StackUnderflow, TypeCheck } from '../errors'
import { executeTests } from '../test-helpers'

describe('operators/add', () => {
  executeTests({
    'adds two integers': {
      src: '1 2 add',
      expect: '3'
    },
    'fails with StackUnderflow on empty stack': {
      src: 'add',
      error: StackUnderflow
    },
    'fails with StackUnderflow on a single stack item': {
      src: '1 add',
      error: StackUnderflow
    },
    'fails with TypeCheck when no numbers are used': {
      src: '"a" "b" add',
      error: TypeCheck
    },
    'fails with TypeCheck when mixed parameters are used': [{
      src: '"a" 2 add',
      error: TypeCheck
    }, {
      src: '1 "b" add',
      error: TypeCheck
    }]
  })
})

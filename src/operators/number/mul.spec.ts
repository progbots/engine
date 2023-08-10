import { StackUnderflow, TypeCheck } from '../../src/errors/index'
import { executeTests } from '../../src/test-helpers'

// test-for integer.ts

describe('operators/number/mul', () => {
  executeTests({
    'multiplies two integers': {
      src: '2 3 mul',
      expect: '6'
    },
    'fails with StackUnderflow on empty stack': {
      src: 'mul',
      error: StackUnderflow
    },
    'fails with StackUnderflow on a single stack item': {
      src: '3 mul',
      error: StackUnderflow
    },
    'fails with TypeCheck when no numbers are used': {
      src: '"a" "b" mul',
      error: TypeCheck
    },
    'fails with TypeCheck when mixed parameters are used': [{
      src: '"a" 2 mul',
      error: TypeCheck
    }, {
      src: '1 "b" mul',
      error: TypeCheck
    }]
  })
})

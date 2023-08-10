import { StackUnderflow, TypeCheck } from '../../src/errors/index'
import { executeTests } from '../../src/test-helpers'

describe('operators/array/join', () => {
  executeTests({
    'converts a string array into a string': {
      src: '[ "Hello" " " "World" " !"] join',
      expect: '"Hello World !"'
    },
    'fails with StackUnderflow on empty stack': {
      src: 'join',
      error: StackUnderflow
    },
    'fails with TypeCheck if not an array': {
      src: '1 join',
      error: TypeCheck
    },
    'fails with TypeCheck if not a string array': {
      src: '[ 1 ] join',
      error: TypeCheck
    }
  })
})

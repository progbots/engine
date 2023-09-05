import { StackUnderflow, TypeCheck } from '@errors'
import { executeStateTests } from '@test/state/execute'

describe('operators/array/join', () => {
  executeStateTests({
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

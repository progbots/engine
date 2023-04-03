import { StackUnderflow, TypeCheck } from '../errors'
import { executeTests } from '../test-helpers'

describe('operators/aload', () => {
  executeTests({
    'pushes all the element of the array': {
      src: '[1 2 3] aload',
      expect: '1 2 3'
    },
    'pushes all the element of the proc': {
      src: '{ 1 2 /add } aload',
      expect: '1 2 /add'
    },
    'fails with StackUnderflow on an empty stack': {
      src: 'aload',
      error: StackUnderflow
    },
    'fails with TypeCheck if not an array or a proc': {
      src: '1 aload',
      error: TypeCheck
    }
  })
})

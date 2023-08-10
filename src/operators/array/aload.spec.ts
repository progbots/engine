import { StackUnderflow, TypeCheck } from '../../src/errors/index'
import { executeTests } from '../../src/test-helpers'

describe('operators/array/aload', () => {
  executeTests({
    'pushes all the element of the array': {
      src: '[1 2 3] aload',
      expect: '1 2 3'
    },
    'pushes all the element of the block': {
      src: '{ 1 2 "add" } aload',
      expect: '1 2 "add"'
    },
    'pushes all the element of the proc': {
      src: 'dict begin "test" { 1 2 "add" } def currentdict "test" get aload end',
      expect: '1 2 "add"'
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

import { StackUnderflow, TypeCheck } from '../errors'
import { executeTests } from '../test-helpers'

describe('operators/if', () => {
  executeTests({
    'evaluates proc if true': {
      src: '0 true { 42 } if',
      expect: '0 42'
    },
    'does not evaluate proc if false': {
      src: '0 false { 42 } if',
      expect: '0'
    },
    'fails with StackUnderflow on empty stack': {
      src: 'if',
      error: StackUnderflow
    },
    'fails with StackUnderflow if boolean missing': {
      src: '{ 42 } if',
      error: StackUnderflow
    },
    'fails with TypeCheck if boolean is there but not the proc': {
      src: 'true /test if',
      error: TypeCheck
    },
    'fails with TypeCheck if proc is there but not the boolean': {
      src: '1 { 42 } if',
      error: TypeCheck
    }
  })
})

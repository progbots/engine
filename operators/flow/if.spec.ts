import { StackUnderflow, TypeCheck } from '../../errors/index'
import { executeTests } from '../../test-helpers'

describe('operators/flow/if', () => {
  executeTests({
    'evaluates block if true': {
      src: '0 true { 42 } if',
      expect: '0 42'
    },
    'does not evaluate block if false': {
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
    'fails with TypeCheck if boolean is there but not the block': {
      src: 'true "test" if',
      error: TypeCheck
    },
    'fails with TypeCheck if block is there but not the boolean': {
      src: '1 { 42 } if',
      error: TypeCheck
    }
  })
})

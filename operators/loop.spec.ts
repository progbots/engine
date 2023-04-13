import { StackUnderflow, TypeCheck } from '../errors/index'
import { executeTests } from '../test-helpers'

describe('operators/loop', () => {
  executeTests({
    'loops until break is called': {
      src: '{ count 5 eq { break } if 1 } loop',
      expect: '1 1 1 1 1'
    },
    'fails with StackUnderflow on empty stack': {
      src: 'loop',
      error: StackUnderflow
    },
    'fails with TypeCheck if proc is not used': {
      src: '1 loop',
      error: TypeCheck
    }
  })
})

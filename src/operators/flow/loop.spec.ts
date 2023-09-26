import { StackUnderflow, TypeCheck } from '@errors'
import { executeStateTests } from '@test/state/execute'

describe('operators/flow/loop', () => {
  executeStateTests({
    'loops until break is called': {
      src: '{ count 5 eq { break } if 1 } loop',
      expect: '1 1 1 1 1'
    },
    'loops until an error occurs': {
      src: '{ typecheck } loop',
      error: TypeCheck
    },
    'fails with StackUnderflow on empty stack': {
      src: 'loop',
      error: StackUnderflow
    },
    'fails with TypeCheck if block is not used': {
      src: '1 loop',
      error: TypeCheck
    }
  })
})

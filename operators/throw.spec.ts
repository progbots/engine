import { StackUnderflow, TypeCheck } from '../errors/index'
import { executeTests } from '../test-helpers'

describe('operators/throw', () => {
  executeTests({
    'fails with StackUnderflow on an empty stack': {
      src: 'throw',
      error: StackUnderflow
    },
    'fails with TypeCheck if the operand is not a dict': [{
      src: '{ } throw',
      error: TypeCheck
    }, {
      src: '"not_a_proc" throw',
      error: TypeCheck
    }]
  })
})

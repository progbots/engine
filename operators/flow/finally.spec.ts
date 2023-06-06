import { StackUnderflow, TypeCheck, Undefined } from '../../errors/index'
import { executeTests } from '../../test-helpers'

describe('operators/flow/finally', () => {
  executeTests({
    'always execute the finally block': {
      src: '{ 1 2 } { 3 } finally',
      expect: '1 2 3'
    },
    'does not prevent exception but enables post processing': {
      src: '{ 1 undefined 2 } { 3 } finally',
      error: Undefined,
      expect: '1 3'
    },
    'throws the last error': {
      src: '{ 1 stackunderflow 2 } { 3 undefined 4 } finally',
      error: Undefined,
      expect: '1 3'
    },
    'fails with StackUnderflow on empty stack': {
      src: 'finally',
      error: StackUnderflow
    },
    'fails with StackUnderflow on a stack with only one block': {
      src: '{ } finally',
      error: StackUnderflow
    },
    'fails with TypeCheck if the operands are not block': [{
      src: '{ } "not_a_proc" finally',
      error: TypeCheck
    }, {
      src: '"not_a_proc" { } finally',
      error: TypeCheck
    }]
  })
})

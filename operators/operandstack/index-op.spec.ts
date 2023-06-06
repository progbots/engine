import { RangeCheck, StackUnderflow, TypeCheck } from '../../errors/index'
import { executeTests } from '../../test-helpers'

describe('operators/operandstack/index', () => {
  executeTests({
    'picks a value in the stack by position': [{
      src: '"a" "b" 1 index',
      expect: '"a"'
    }, {
      src: '"a" "b" 0 index',
      expect: '"b"'
    }],
    'fails with StackUnderflow when going beyond the stack size': {
      src: '"a" "b" 2 index',
      error: StackUnderflow
    },
    'fails with RangeError when using negative index': {
      src: '"a" "b" -1 index',
      error: RangeCheck
    },
    'fails with TypeCheck when index is not an integer': {
      src: '"a" "b" index',
      error: TypeCheck
    }
  })
})

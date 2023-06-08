import { RangeCheck, StackUnderflow, TypeCheck } from '../../errors/index'
import { executeTests } from '../../test-helpers'

describe('operators/array/apop', () => {
  executeTests({
    'removes the last element of  the array': {
      src: 'mark [1 2 3] dup apop exch aload',
      expect: 'mark 3 1 2'
    },
    'fails with StackUnderflow on insufficient stack': {
      src: 'apop',
      error: StackUnderflow
    },
    'fails with RangeCheck on empty array': {
      src: '[] apop',
      error: RangeCheck
    },
    'fails with TypeCheck if array is missing': {
      src: '1 apop',
      error: TypeCheck
    }
  })
})

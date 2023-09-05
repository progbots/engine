import { RangeCheck, StackUnderflow, TypeCheck } from '@errors'
import { executeStateTests } from '@test/state/execute'

describe('operators/array/apop', () => {
  executeStateTests({
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
    // TODO add a test with a shared object stored in the array
  })
})

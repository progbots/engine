import { StackUnderflow, TypeCheck } from '../../errors/index'
import { executeTests } from '../../test-helpers'

// test-for integer.ts

describe('operators/number/gte', () => {
  executeTests({
    'outputs 1 > 1': {
      src: '1 1 gte',
      expect: 'true'
    },
    'outputs 1 >= 2': {
      src: '1 2 gte',
      expect: 'false'
    },
    'outputs 2 >= 1': {
      src: '2 1 gte',
      expect: 'true'
    },
    'fails with StackUnderflow on insufficient stack': [{
      src: 'gte',
      error: StackUnderflow
    }, {
      src: '1 gte',
      error: StackUnderflow
    }],
    'fails with TypeCheck if not integers': [{
      src: '"1" 2 gte',
      error: TypeCheck
    }, {
      src: '1 "2" gte',
      error: TypeCheck
    }]
  })
})

import { StackUnderflow, TypeCheck } from '../../src/errors/index'
import { executeTests } from '../../src/test-helpers'

// test-for integer.ts

describe('operators/number/lt', () => {
  executeTests({
    'outputs 1 < 1': {
      src: '1 1 lt',
      expect: 'false'
    },
    'outputs 1 < 2': {
      src: '1 2 lt',
      expect: 'true'
    },
    'outputs 2 < 1': {
      src: '2 1 lt',
      expect: 'false'
    },
    'fails with StackUnderflow on insufficient stack': [{
      src: 'lt',
      error: StackUnderflow
    }, {
      src: '1 lt',
      error: StackUnderflow
    }],
    'fails with TypeCheck if not integers': [{
      src: '"1" 2 lt',
      error: TypeCheck
    }, {
      src: '1 "2" lt',
      error: TypeCheck
    }]
  })
})

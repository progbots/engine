import { StackUnderflow, TypeCheck } from '@errors'
import { executeStateTests } from '@test/state/execute'

// test-for integer.ts

describe('operators/number/gt', () => {
  executeStateTests({
    'outputs 1 > 1': {
      src: '1 1 gt',
      expect: 'false'
    },
    'outputs 1 > 2': {
      src: '1 2 gt',
      expect: 'false'
    },
    'outputs 2 > 1': {
      src: '2 1 gt',
      expect: 'true'
    },
    'fails with StackUnderflow on insufficient stack': [{
      src: 'gt',
      error: StackUnderflow
    }, {
      src: '1 gt',
      error: StackUnderflow
    }],
    'fails with TypeCheck if not integers': [{
      src: '"1" 2 gt',
      error: TypeCheck
    }, {
      src: '1 "2" gt',
      error: TypeCheck
    }]
  })
})

import { StackUnderflow, TypeCheck } from '../errors/index'
import { executeTests } from '../test-helpers'

describe('operators/lte', () => {
  executeTests({
    'outputs 1 <= 1': {
      src: '1 1 lte',
      expect: 'true'
    },
    'outputs 1 <= 2': {
      src: '1 2 lte',
      expect: 'true'
    },
    'outputs 2 <= 1': {
      src: '2 1 lte',
      expect: 'false'
    },
    'fails with StackUnderflow on insufficient stack': [{
      src: 'lte',
      error: StackUnderflow
    }, {
      src: '1 lte',
      error: StackUnderflow
    }],
    'fails with TypeCheck if not integers': [{
      src: '"1" 2 lte',
      error: TypeCheck
    }, {
      src: '1 "2" lte',
      error: TypeCheck
    }]
  })
})

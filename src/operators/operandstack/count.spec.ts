import { executeTests } from '../../src/test-helpers'

describe('operators/operandstack/count', () => {
  executeTests({
    'counts the number of items in the stack': [{
      src: 'count',
      expect: '0'
    }, {
      src: '1 2 3 count',
      expect: '1 2 3 3'
    }]
  })
})

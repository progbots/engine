import { executeTests } from '../../src/test-helpers'
import { ValueType } from '../../index'

describe('operators/constant/false', () => {
  executeTests({
    'adds false to the stack': {
      src: 'false',
      expect: [{
        type: ValueType.boolean,
        data: false
      }]
    }
  })
})

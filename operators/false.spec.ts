import { executeTests } from '../test-helpers'
import { ValueType } from '../index'

describe('operators/false', () => {
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

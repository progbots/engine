import { executeTests } from '../../test-helpers'
import { ValueType } from '../../index'

describe('operators/constant/true', () => {
  executeTests({
    'adds true to the stack': {
      src: 'true',
      expect: [{
        type: ValueType.boolean,
        data: true
      }]
    }
  })
})

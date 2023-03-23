import { executeTests } from '../test-helpers'
import { ValueType } from '..'

describe('operators/true', () => {
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
